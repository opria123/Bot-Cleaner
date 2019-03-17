pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                bat 'ls'
                bat 'kubectl apply -f kube-stack.yaml'
            }
        }
    }
}