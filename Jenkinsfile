// Jenkinsfile for notionx-frontend
pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = sh(script: 'aws sts get-caller-identity --query Account --output text', returnStdout: true).trim()
        AWS_REGION     = 'us-east-1' // CRITICAL: Ensure this matches your AWS region!
        ECR_REGISTRY   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        ECR_REPOSITORY = "notionx-frontend" // Name of the ECR repo created by Terraform
        IMAGE_NAME     = "${ECR_REGISTRY}/${ECR_REPOSITORY}"
        IMAGE_TAG      = "build-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/maheshpaulj/NotionX-Frontend.git' // **UPDATE THIS WITH YOUR ACTUAL GITHUB URL**
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }
        stage('Login to ECR & Push Image') {
            steps {
                script {
                    // Use the 'aws-credentials' defined in Jenkins
                    withAWS(credentials: 'aws-credentials', region: AWS_REGION) {
                        sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
                    }
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Ensure Jenkins user can access Kubernetes config (copied from ec2-user's home)
                    sh 'sudo mkdir -p /var/lib/jenkins/.kube'
                    sh 'sudo cp /home/ec2-user/.kube/config /var/lib/jenkins/.kube/config'
                    sh 'sudo chown jenkins:jenkins /var/lib/jenkins/.kube/config'
                    sh 'sudo chmod 600 /var/lib/jenkins/.kube/config' // Ensure correct permissions

                    // Replace image placeholders in the deployment yaml
                    sh "sed -i 's|__IMAGE_URL__|${IMAGE_NAME}|g' k8s/deployment.yaml"
                    sh "sed -i 's|__IMAGE_TAG__|${IMAGE_TAG}|g' k8s/deployment.yaml"

                    // Apply Kubernetes manifests
                    sh 'kubectl apply -f k8s/service.yaml'
                    sh 'kubectl apply -f k8s/deployment.yaml'
                    
                    // Optional: Wait for deployment rollout to complete
                    sh 'kubectl rollout status deployment/notionx-frontend-deployment'
                }
            }
        }
    }
    post {
        always {
            cleanWs() // Clean up Jenkins workspace
            sh 'git checkout -- k8s/deployment.yaml' // Revert changes to the yaml file for next build
        }
    }
}