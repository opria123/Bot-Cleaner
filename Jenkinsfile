pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                kubectl apply -f kube-stack.yaml
            }
        }
    }
}