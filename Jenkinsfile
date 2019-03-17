pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                sh 'kubectl apply -f kube-stack.yaml'
            }
        }
    }
}