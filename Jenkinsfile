pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                bat 'kubectl'
                sh 'kubectl apply -f kube-stack.yml'
            }
        }
    }
}