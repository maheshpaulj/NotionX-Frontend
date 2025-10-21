pipeline {
    agent any

    environment {
        AWS_REGION     = 'us-east-1'
        ECR_REPOSITORY = "notionx-frontend"
        IMAGE_TAG      = "build-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: 'https://github.com/maheshpaulj/NotionX-Frontend.git'
            }
        }

        stage('Build & Push to ECR') {
            steps {
                withAWS(credentials: 'aws-credentials', region: AWS_REGION) {
                    script {
                        // 1. Get the AWS Account ID
                        def accountId = sh(script: 'aws sts get-caller-identity --query Account --output text', returnStdout: true).trim()
                        def ecrRegistry = "${accountId}.dkr.ecr.${AWS_REGION}.amazonaws.com"

                        // 2. Construct the full, correct image name
                        def fullImageName = "${ecrRegistry}/${ECR_REPOSITORY}:${IMAGE_TAG}"
                        
                        // 3. Login to the correct ECR registry
                        sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ecrRegistry}"

                        // 4. Build the image and TAG IT with the FULL name
                        sh "docker build --shm-size=1g -t ${fullImageName} ."

                        // 5. Push the correctly tagged image
                        sh "docker push ${fullImageName}"

                        // 6. Pass the full image name to the next stage
                        env.IMAGE_NAME_FOR_DEPLOY = fullImageName
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh 'sudo mkdir -p /var/lib/jenkins/.kube'
                    sh 'sudo cp /home/ec2-user/.kube/config /var/lib/jenkins/.kube/config'
                    sh 'sudo chown jenkins:jenkins /var/lib/jenkins/.kube/config'
                    sh 'sudo chmod 600 /var/lib/jenkins/.kube/config'
                    
                    // Create/Update ECR secret
                    sh '''
                        kubectl create secret docker-registry ecr-secret \
                        --docker-server=503698126220.dkr.ecr.us-east-1.amazonaws.com \
                        --docker-username=AWS \
                        --docker-password=$(aws ecr get-login-password --region us-east-1) \
                        --namespace=default \
                        --dry-run=client -o yaml | kubectl apply -f -
                    '''
                    
                    // Update image tag in deployment
                    sh "sed -i 's|__IMAGE_URL__:__IMAGE_TAG__|503698126220.dkr.ecr.us-east-1.amazonaws.com/notionx-frontend:build-${BUILD_NUMBER}|g' k8s/deployment.yaml"
                    
                    // Apply configurations
                    sh 'kubectl apply -f k8s/service.yaml'
                    sh 'kubectl apply -f k8s/deployment.yaml'
                    
                    // Wait for rollout with better error handling
                    sh '''
                        kubectl rollout status deployment/notionx-frontend-deployment --timeout=5m || \
                        (echo "Deployment failed. Pod status:" && \
                        kubectl get pods -l app=notionx-frontend && \
                        echo "Pod descriptions:" && \
                        kubectl describe pods -l app=notionx-frontend && \
                        echo "Pod logs:" && \
                        kubectl logs -l app=notionx-frontend --tail=100 || true && \
                        exit 1)
                    '''
                }
            }
        }
    post {
        always {
            cleanWs()
            sh "docker system prune -a -f" // Proactively clean up space
        }
    }
}