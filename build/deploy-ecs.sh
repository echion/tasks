login=$(aws ecr get-login)
name="echion-tasks"

sh -c "$login"

docker info
docker build -t $name .
docker tag $name:latest $AWS_ECR_URL/echion:latest
docker push $AWS_ECR_URL/echion:latest