pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                sh 'ls'
                sh 'cd Bot-Cleaner/'
                sh 'kubectl apply -f kube-stack.yaml'
            }
        }
    }
}