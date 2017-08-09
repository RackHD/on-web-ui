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
    bd.setRunScript('''#!/bin/bash -e
                    #download manifest
                    curl --user $BINTRAY_CREDS -L "$MANIFEST_FILE_URL" -o rackhd-manifest
                    echo using artifactory : $ARTIFACTORY_URL

                    #clone
                    ./build-config/build-release-tools/HWIMO-BUILD ./build-config/build-release-tools/application/reprove.py \
                    --manifest rackhd-manifest \
                    --builddir ./$CLONE_DIR \
                    --jobs 2 \
                    --force \
                    checkout \
                    packagerefs-commit

                    #docker images build
                    REPOS="on-web-ui on-wss"
                    pushd build-config/build-release-tools/
                    ./docker_build.sh $WORKSPACE/$CLONE_DIR $IS_OFFICIAL_RELEASE $RPOS
                    cp $WORKSPACE/$CLONE_DIR/build_record $WORKSPACE
                    popd

                    # save docker image to tar
                    image_list=`cat $WORKSPACE/$CLONE_DIR/build_record | xargs`

                    docker save -o rackhd_docker_images.tar $image_list

                    # copy build_record to current directory for stash
                    cp $WORKSPACE/$CLONE_DIR/build_record .
                    ''')
    bd.runDockerBuild()
}

def buildImages(String repo_dir){
    // retry times for images build to avoid failing caused by network
    int retry_times = 3
    stage("Build Docker"){
        retry(retry_times){
            buildDocker()
        }
    }
}

def publishImages(String repo_dir){
    stage("Publish"){
        parallel 'Publish Debian':{
            new rackhd.release.release_debian().execute()
        }, 'Publish Docker':{
            load(repo_dir + "/jobs/release/release_docker.groovy")
        }
    }
}

def createTag(String repo_dir){
    stage("Create Tag"){
        new rackhd.SprintRelease.create_tag().execute()
    }
}

def buildAndPublish(Boolean publish, Boolean tag, String repo_dir){
    buildPackage(repo_dir)
    buildImages(repo_dir)
    if(tag){
        createTag(repo_dir)
    }
    if(publish){
        publishImages(repo_dir)
    }
}

return this
