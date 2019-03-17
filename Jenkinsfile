pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                bat 'dir'
                bat 'kubectl apply -f kube-stack.yaml'
            }
        }
    }
}