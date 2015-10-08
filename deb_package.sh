#!/bin/bash

# Copyright 2015, EMC, Inc.

# debian packages expected...
# apt-get install git pbuilder dh-make ubuntu-dev-tools devscripts

if [ -n "$JENKINS_PROVISION" ]; then
  git clone . packagebuild
  pushd packagebuild
fi

git log -n 1 --pretty=format:%h.%ai.%s > on-web-ui_commitstring.txt

GITCOMMITDATE=$(git show -s --pretty="format:%ci")
DATESTRING=$(date -d "$GITCOMMITDATE" -u +"%Y-%m-%d-%H%M%SZ")

PKG_VERSION="$DATESTRING"
if [ -n "$BUILD_NUMBER" ]; then
  PKG_VERSION="${PKG_VERSION}-${BUILD_NUMBER}"
fi

export DEBEMAIL="hwimo robots <hwimo@hwimo.lab.emc.com>"
export DEBFULLNAME="The HWIMO Robots"

# TMP HACK: This is a temporary hack to get packaging to work on Jenkins until HeckJ can help me figure out why it trying to copy files from /tmp
if [ -n "$JENKINS_PROVISION" ]; then
  # ls -a ../
  # ls -a ./
  cp -avr ../build ./debian/tmp
  cp -avr ../build ../debian/tmp
  cp -av ./index.html ./debian/tmp/index.html
  cp -av ./index.html ../debian/tmp/index.html
  cp -av ./on-web-ui_commitstring.txt ./debian/tmp/on-web-ui_commitstring.txt
  cp -av ./on-web-ui_commitstring.txt ../debian/tmp/on-web-ui_commitstring.txt
fi

dch -v ${PKG_VERSION} autobuild
debuild --no-lintian --no-tgz-check -us -uc

if [ -n "$JENKINS_PROVISION" ]; then
  popd
fi
