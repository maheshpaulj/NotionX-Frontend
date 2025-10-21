// Jenkinsfile for notionx-frontend (CORRECTED AND ROBUST VERSION)
pipeline {
    agent any

    environment {
        // --- CORRECTED SECTION ---
        // We will construct the ECR registry URL directly.
        // The AWS Account ID will be retrieved from the login step itself later.
        AWS_REGION     = 'us-east-1' // CRITICAL: Ensure this matches your AWS region!
        ECR_REPOSITORY = "notionx-frontend" // Name of the ECR repo created by Terraform
        IMAGE_TAG      = "build-${BUILD_NUMBER}"
        // The problematic line trying to run 'aws sts' has been completely removed.
    }

    stages {
        stage('Checkout Code') {
            steps {
                // The branch was 'master' in your log, so I've updated it. Change to 'main' if needed.
                git branch: 'master', url: 'https://github.com/maheshpaulj/NotionX-Frontend.git' // YOUR URL IS CORRECT
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // This command uses the AWS Account ID provided by the 'aws ecr' command itself.
                    def accountId = sh(script: 'aws sts get-caller-identity --query Account --output text', returnStdout: true).trim()
                    def ecrRegistry = "${accountId}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                    def imageName = "${ecrRegistry}/${ECR_REPOSITORY}"
                    
                    sh "docker build -t ${imageName}:${IMAGE_TAG} ."
                }
            }
        }
        stage('Login to ECR & Push Image') {
            steps {
                // This entire block is now wrapped in withAWS, ensuring credentials are available.
                withAWS(credentials: 'aws-credentials', region: AWS_REGION) {
                    script {
                        def accountId = sh(script: 'aws sts get-caller-identity --query Account --output text', returnStdout: true).trim()
                        def ecrRegistry = "${accountId}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                        def imageName = "${ecrRegistry}/${ECR_REPOSITORY}"
                        
                        // Perform ECR login
                        sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ecrRegistry}"
                        
                        // Push the image
                        sh "docker push ${imageName}:${IMAGE_TAG}"
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                withAWS(credentials: 'aws-credentials', region: AWS_REGION) {
                    script {
                        def accountId = sh(script: 'aws sts get-caller-identity --query Account --output text', returnStdout: true).trim()
                        def ecrRegistry = "${accountId}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                        def imageName = "${ecrRegistry}/${ECR_REPOSITORY}"

                        // Ensure Jenkins user can access Kubernetes config
                        sh 'sudo mkdir -p /var/lib/jenkins/.kube'
                        sh 'sudo cp /home/ecr-user/.kube/config /var/lib/jenkins/.kube/config'
                        sh 'sudo chown jenkins:jenkins /var/lib/jenkins/.kube/config'
                        sh 'sudo chmod 600 /var/lib/jenkins/.kube/config'

                        // Replace image placeholders
                        sh "sed -i 's|__IMAGE_URL__|${imageName}|g' k8s/deployment.yaml"
                        sh "sed -i 's|__IMAGE_TAG__|${IMAGE_TAG}|g' k8s/deployment.yaml"

                        // Apply Kubernetes manifests
                        sh 'kubectl apply -f k8s/service.yaml'
                        sh 'kubectl apply -f k8s/deployment.yaml'
                        sh 'kubectl rollout status deployment/notionx-frontend-deployment'
                    }
                }
            }
        }
    }
    post {
        always {
            // This will now work because the pipeline won't fail prematurely.
            cleanWs()
            sh 'git checkout -- k8s/deployment.yaml'
        }
    }
}