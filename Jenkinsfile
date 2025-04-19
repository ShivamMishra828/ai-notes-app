@Library("Shared") _
pipeline {
    agent {label "aws-ec2-ubuntu-agent-1"}

    stages {
        stage("Pulling the Code") {
            steps {
                script {
                    clone("https://github.com/ShivamMishra828/ai-notes-app.git", "main")
                }
            }
        }

        stage("Building the Code") {
            steps {
                script {
                    docker_build("ai-notes-app", "latest")
                }
            }
        }

        stage("Pushing the image to Docker Hub") {
            steps {
                script {
                    docker_push("ai-notes-app", "latest")
                }
            }
        }

        stage("Deploying the code to EC2") {
            steps {
                echo "Deploying the code with the help of docker..."
                sh "docker compose up -d"
            }
        }
    }
}
