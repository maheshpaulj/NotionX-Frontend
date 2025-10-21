// Jenkinsfile (FINAL, SIMPLIFIED, AND CORRECTED VERSION)
pipeline {
    agent any

    // Define a top-level variable to hold the full image name
    def IMAGE_NAME

    environment {
        AWS_REGION     = 'us-east-1' // CRITICAL: Ensure this matches your AWS region!
        ECR_REPOSITORY = "notionx-frontend" // Name of the ECR repo created by Terraform
        IMAGE_TAG      = "build-${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Your log shows the branch is 'master'.
                git branch: 'master', url: 'https://github.com/maheshpaulj/NotionX-Frontend.git'
            }
        }

        stage('Build & Push to ECR') {
            steps {
                // Wrap ALL AWS-related activity in this block
                withAWS(credentials: 'aws-credentials', region: AWS_REGION) {
                    script {
                        // 1. Get the AWS Account ID
                        def accountId = sh(script: 'aws sts get-caller-identity --query Account --output text', returnStdout: true).trim()
                        def ecrRegistry = "${accountId}.dkr.ecr.${AWS_REGION}.amazonaws.com"

                        // 2. Construct the full image name and assign it to our top-level variable
                        IMAGE_NAME = "${ecrRegistry}/${ECR_REPOSITORY}:${IMAGE_TAG}"

                        // 3. Login to ECR
                        sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ecrRegistry}"

                        // 4. Build the image with the full name
                        sh "docker build -t ${IMAGE_NAME} ."

                        // 5. Push the image
                        sh "docker push ${IMAGE_NAME}"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // This stage does not need AWS credentials, it just needs the correct IMAGE_NAME

                    // Ensure Jenkins user can access Kubernetes config
                    sh 'sudo mkdir -p /var/lib/jenkins/.kube'
                    sh 'sudo cp /home/ec2-user/.kube/config /var/lib/jenkins/.kube/config'
                    sh 'sudo chown jenkins:jenkins /var/lib/jenkins/.kube/config'
                    sh 'sudo chmod 600 /var/lib/jenkins/.kube/config'

                    // Replace the single placeholder with the full image name we built
                    // This is cleaner than two separate 'sed' commands.
                    sh "sed -i 's|__IMAGE_URL__:__IMAGE_TAG__|${IMAGE_NAME}|g' k8s/deployment.yaml"

                    // Apply Kubernetes manifests
                    sh 'kubectl apply -f k8s/service.yaml'
                    sh 'kubectl apply -f k8s/deployment.yaml'
                    sh 'kubectl rollout status deployment/notionx-frontend-deployment'
                }
            }
        }
    }
    post {
        always {
            // cleanWs() is sufficient. The git checkout after a clean is problematic.
            // The next build will start with a fresh checkout anyway.
            cleanWs()
        }
    }
}