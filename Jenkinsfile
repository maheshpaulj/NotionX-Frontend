// Jenkinsfile (FINAL, SYNTACTICALLY CORRECT VERSION)
pipeline {
    agent any

    environment {
        AWS_REGION     = 'us-east-1' // CRITICAL: Ensure this matches your AWS region!
        ECR_REPOSITORY = "notionx-frontend" // Name of the ECR repo from Terraform
        IMAGE_TAG      = "build-${BUILD_NUMBER}"
        // Declare IMAGE_NAME here as an empty string. We will populate it in the build stage.
        IMAGE_NAME     = ""
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

                        // 2. Populate the environment variable with the full image name
                        env.IMAGE_NAME = "${ecrRegistry}/${ECR_REPOSITORY}:${IMAGE_TAG}"

                        // 3. Login to ECR
                        sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ecrRegistry}"

                        // 4. Build the image
                        sh "docker build -t ${env.IMAGE_NAME} ."

                        // 5. Push the image
                        sh "docker push ${env.IMAGE_NAME}"
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

                    // Use the environment variable we populated in the previous stage
                    sh "sed -i 's|__IMAGE_URL__:__IMAGE_TAG__|${env.IMAGE_NAME}|g' k8s/deployment.yaml"

                    sh 'kubectl apply -f k8s/service.yaml'
                    sh 'kubectl apply -f k8s/deployment.yaml'
                    sh 'kubectl rollout status deployment/notionx-frontend-deployment'
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}