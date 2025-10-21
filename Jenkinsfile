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

                    // Use the image name passed from the previous stage
                    sh "sed -i 's|__IMAGE_URL__:__IMAGE_TAG__|${env.IMAGE_NAME_FOR_DEPLOY}|g' k8s/deployment.yaml"

                    sh 'kubectl apply -f k8s/service.yaml'
                    sh 'kubectl apply -f k8s/deployment.yaml'
                    sh 'kubectl rollout status deployment/notionx-frontend-deployment'
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