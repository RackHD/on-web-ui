 #!/bin/bash -ex

docker_img_name=$1
ver=$2



#stop old containers
prev_id=$(docker ps | grep $docker_img_name  | awk '{ print $1 }')
if [ "$prev_id" != "" ]; then
     docker rm -f $prev_id
fi

#remove old images
prev_img=$(docker images $docker_img_name  -q )
if [ "$prev_img" != "" ]; then
    docker rmi -f $prev_img
fi

#run new container
docker pull ${docker_img_name}:${ver}
docker run -d -p 8081:80 ${docker_img_name}:${ver}

