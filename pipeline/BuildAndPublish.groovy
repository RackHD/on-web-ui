def buildPackage(){
    // retry times for package build to avoid failing caused by network
    int retry_times = 3
    stage("Packages Build"){
        retry(retry_times){
            new rackhd.build_debian.build_debian().execute()
        }
    }
}

def buildDocker(){
    def bd = new rackhd.build_docker.build_docker()
    bd.setRunScript('pipeline/BuildDocker/build_docker.sh')
    bd.runDockerBuild()
}

def buildImages(){
    // retry times for images build to avoid failing caused by network
    int retry_times = 3
    stage("Build Docker"){
        retry(retry_times){
            buildDocker()
        }
    }
}

def publishImages(){
    stage("Publish"){
        parallel 'Publish Debian':{
            new rackhd.release.release_debian().execute()
        }, 'Publish Docker':{
            new rackhd.release.release_docker().execute()
        }
    }
}

def createTag(){
    stage("Create Tag"){
        new rackhd.SprintRelease.create_tag().execute()
    }
}

def buildAndPublish(Boolean publish, Boolean tag){
    buildPackage()
    buildImages()
    if(tag){
        createTag()
    }
    if(publish){
        publishImages()
    }
}

return this
