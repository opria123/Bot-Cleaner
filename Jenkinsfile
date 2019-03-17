pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                cd Bot-Cleaner/
                kubectl apply -f kube-stack.yaml
            }
        }
    }
}