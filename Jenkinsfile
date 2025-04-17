pipeline {
    agent {label "aws-ec2-ubuntu-agent-1"}

    stages {
        stage("Pulling the Code") {
            steps {
                echo "Pulling the code from Github..."
                git url: "https://github.com/ShivamMishra828/ai-notes-app.git", branch: "main"
                echo "Pulled code from Github successfully..."
            }
        }

        stage("Building the Code") {
            steps {
                echo "Building the code into Docker Image..."
                sh "docker build -t ai-notes-app:latest ."
                echo "Builed the code successfully..."
            }
        }

        stage("Pushing the image to Docker Hub") {
            steps {
                echo "Pushing the image to Docker Hub..."
                withCredentials([usernamePassword(
                    'credentialsId': "DockerHubCred", 
                    passwordVariable: "DockerHubPass", 
                    usernameVariable: "DockerHubUser")]){
                    sh "docker login -u ${env.DockerHubUser} -p ${env.DockerHubPass}"
                    sh "docker image tag ai-notes-app:latest ${env.DockerHubUser}/ai-notes-app:latest"
                    sh "docker push ${env.DockerHubUser}/ai-notes-app:latest"
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
