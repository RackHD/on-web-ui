#!/bin/bash -e

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
