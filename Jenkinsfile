properties([
    pipelineTriggers([
        [$class: 'GitHubPushTrigger']
    ])
])

pipeline {
    agent any

    environment {
        DOCKER_CONTAINER = "front-sha8alny"
        DOCKER_IMAGE_FRONT = "sha8alny-front"
        GIT_REPO = "https://github.com/sha8alny/Sha8alny_Frontend.git"
    }
    stages {
        stage('Clone Repository') {
            steps {
                echo "Cloning repository..."
                sh '''
                rm -rf ./*         # Removes all files
                rm -rf .??*        # Removes hidden files like .git
                '''
                withCredentials([usernamePassword(credentialsId: 'Github_Token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                sh '''
                    git clone -b main https://${GIT_USER}:${GIT_TOKEN}@github.com/sha8alny/Sha8alny_Frontend.git .
                '''
                }
            }
        }

        stage('ENV Variables') {
            steps{
                withCredentials([file(credentialsId: 'sha8alny_ENV_FRONT', variable: 'ENV_FILE')]) {
                    sh 'cp $ENV_FILE ./.env'
                    sh 'chmod 600 ./.env'
                }
                withCredentials([file(credentialsId: 'sha8alny_DOCKERFILE_FRONT', variable: 'DOCKERFILE')]) {
                    sh 'cp $DOCKERFILE ./Dockerfile'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh '''
                docker stop ${DOCKER_CONTAINER} || true
                docker rm ${DOCKER_CONTAINER} || true
                docker rmi ${DOCKER_IMAGE_FRONT} || true
                docker build -t ${DOCKER_IMAGE_FRONT} .
                '''
            }
        }

        // stage('Run Unit Tests') {
        //     steps {
        //         script {
        //             sh "docker run --rm ${DOCKER_IMAGE}:latest npm test"  // Modify as per your project
        //         }
        //     }
        // }

        stage('Deploy Application') {
            steps {
                echo "Deploying application..."
                sh '''
                docker run -d \
                    --name ${DOCKER_CONTAINER} \
                    -p 80:3000 \
                    --restart=always\
                    ${DOCKER_IMAGE_FRONT}
                '''
            }
        }

        // stage('Clean Up') {
        //     steps {
        //         script {
        //             sh "docker system prune -f"
        //         }
        //     }
        // }
    }
    
    post {
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}