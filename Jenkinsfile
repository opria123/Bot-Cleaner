pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                bat 'kubectl'
                bat 'kubectl apply -f kube-stack.yml'
            }
        }
    }
}