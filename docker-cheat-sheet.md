# Docker

### Main docker commands list
- _maybe required_ `sudo` _on linux or macos systems_
- _depending on the way of installation_ `docker compose` _also may be replaced with_ `docker-compose`

##### Docker version
`docker -v` - docker version  
`docker compose version` - docker-compose version  

##### List images and containers
`docker images` - list of the images  
`docker rmi <image ID>` - remove image by id  
`docker ps` - list of all running containers  
`docker ps -a` - list of all running and stopped containers  
`docker rm <container ID>` - remove container by id  
`docker system prune` - remove all stopped containers  
`docker logs <container ID>` - logging container  
##### Build image using Dockerfile
- _run it in directory with_ **Dockerfile**

`docker build .` - create image of your project according to the steps provided in Dockerfile  
`docker build -t <image name> .` - create image with tag  

##### Containers
`docker create <image TAG or ID>` - create container from built image (returns ID of new container)  
`docker start <container ID>` - run container  
`docker start -a <container ID>` - run container and watch output  
`docker run <image TAG or ID>` - create container from image and start it (shortcut for docker create + docker start)  
`docker run -p 3000:3000 <image TAG or ID>` - set port to expose  
`docker exec -it <container ID> sh` - run command inside container, for example **sh**  
`docker stop <container ID>` - stop container  
`docker kill <container ID>` - kill container immediately  

##### Docker compose
- _run in directory with_ **docker-compose.yml** _file_

`docker compose up` - build images and run all services  
`docker compose up -d` - same as above, but starts the containers in the background and leaves them running  
`docker compose down` - stop services  