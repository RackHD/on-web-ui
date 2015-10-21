#!/bin/bash

# Copyright 2015, EMC, Inc.

# Flags:
# VERBOSE_PROVISION -- If set, log commands and stderr.
# JENKINS_PROVISION -- If set, do not checkout source code from git.
# VAGRANT_PROVISION -- If set, copy mounted /vagrant directory for source code.
# DOCKER_PROVISION -- If set, will only ensure node and on-web-ui code is available, then runs docker build.
# NODE_VERSION -- If set, overrides the target node version.
# BUILD_ON_WEB_UI -- If set, run on-web-ui build and deploy.
# TEST_ON_WEB_UI -- If set, run on-web-ui test suite.
# RUN_ON_WEB_UI -- If set, run on-web-ui development server.

if [ -n "$VERBOSE_PROVISION" ]; then
  printf "\n\nEnable verbose provision:\n\n"
  set -e
  set -x
fi

if [ -z "$DOCKER_PROVISION" ]; then
  printf "\n\nInstall core dependencies:\n\n"
  which git || apt-get install -y git curl || true

  if [ -n "$TEST_ON_WEB_UI" ]; then
    printf "\n\nInstall test dependencies:\n\n"
    apt-get update -y || true
    which xvfb || apt-get install -y xvfb || true
    which firefox || apt-get install -y firefox || true
    which chromium-browser || apt-get install -y chromium-browser || true

    printf "\n\nEnable xvfb server:\n"
    Xvfb :1 -screen 5 1024x768x8 &
    export DISPLAY=:1.5
  fi

  printf "\n\nSetup on-web-ui temporary folder:\n\n"
  mkdir -p /tmp/on-web-ui

  printf "\n\nInstall and source NVM:\n"
  [ -f /tmp/nvm/nvm.sh ] ||
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | NVM_DIR=/tmp/nvm bash
  nvm || . /tmp/nvm/nvm.sh

  [ -z "$NODE_VERSION" ] && NODE_VERSION="4.1.1"
  CURRENT_NODE=`nvm current`
  if [ "v$NODE_VERSION" == "$CURRENT_NODE" ]; then
    printf "\n\nNode v$NODE_VERSION is current.\n\n"
  else
    printf "\n\nInstall v$NODE_VERSION:"
    nvm install "v$NODE_VERSION"
    nvm use "$NODE_VERSION"
    nvm alias default "$NODE_VERSION"
  fi
fi

printf "\n\nDetect on-web-ui source:\n\n"
if [ -z "$JENKINS_PROVISION" ]; then
  if [ -n "$VAGRANT_PROVISION" ]; then
    printf "\n\nCopy on-web-ui from vagrant mount:\n\n"
    cp -R /vagrant/* /tmp/on-web-ui
    cd /tmp/on-web-ui
  else
    if [ -f /tmp/on-web-ui/package.json ]; then
      printf "\n\nUpdate on-web-ui:\n\n"
      cd /tmp/on-web-ui
      git pull origin master
    else
      printf "\n\nDownload on-web-ui:\n\n"
      cd /tmp
      git clone ssh://git@hwstashprd01.isus.emc.com:7999/onrack/on-web-ui.git
      cd /tmp/on-web-ui
    fi
  fi
else
  printf "\n\nJenkins already checked out on-web-ui from git.\n\n"
fi

if [ -n "$DOCKER_PROVISION" ]; then
  printf "\n\nBuild docker container:\n\n"
  docker build -t on-web-ui .

  printf "\n\nRun docker container:\n\n"
  docker run on-web-ui
else
  printf "\n\nInstall on-web-ui:\n\n"
  npm run-script uninstall
  npm install

  if [ -n "$TEST_ON_WEB_UI" ]; then
    printf "\n\nLint on-web-ui:\n\n"
    npm run-script lint

    printf "\n\nTest on-web-ui:\n\n"
    npm run-script test-ci
  fi

  if [ -n "$BUILD_ON_WEB_UI" ]; then
    printf "\n\nBuild on-web-ui:\n\n"
    pushd dev
    ./node_modules/.bin/gulp build --release
    popd

    if [ -n "$VAGRANT_PROVISION" ]; then
      printf "\n\nInstall packaging tools:\n\n"
      apt-get update -y
      apt-get install -y --fix-missing pbuilder dh-make ubuntu-dev-tools devscripts
    fi

    printf "\n\Create debian package for on-web-ui:\n\n"
    ./dev/deb_package.sh
  fi

  if [ -n "$RUN_ON_WEB_UI" ]; then
    printf "\n\nRun on-web-ui:\n\n"
    nohup bash -c "node scripts/tools/code_server.js &"
    nohup bash -c "gulp &"
  fi
fi
