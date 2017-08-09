if (env.LIB_VERSION == null || env.LIB_VERSION == ""){
    env.LIB_VERSION="master"
}
if (env.LIB_URL == null || env.LIB_URL == ""){
    env.LIB_URL="https://github.com/rackhd/on-build-config"
}
if (env.LIB_NAME == null || env.LIB_NAME == ""){
    env.LIB_NAME="rackhd-devel-lib"
}

library env.LIB_NAME

node {
    checkout scm
    load('pipeline/SprintRelease/SprintRelease')
}

