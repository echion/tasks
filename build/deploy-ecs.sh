login=$(aws ecr get-login)

sh -c "$login"

docker tag echion-tasks:latest $AWS_ECR_URL/echion:latest
docker push $AWS_ECR_URL/echion:latest