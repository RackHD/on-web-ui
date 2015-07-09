#!/bin/bash

# Flags:
# VERBOSE_PROVISION -- If set, log commands and stderr.
# JENKINS_PROVISION -- If set, do not checkout source code from git.
# VAGRANT_PROVISION -- If set, copy mounted /vagrant directory for source code.
# NODE_VERSION -- If set, overrides the target node version.
# BUILD_ON_WEB_UI -- If set, run on-web-ui build and deploy.
# TEST_ON_WEB_UI -- If set, run on-web-ui test suite.
# RUN_ON_WEB_UI -- If set, run on-web-ui development server.

if [ -n "$VERBOSE_PROVISION" ]; then
  echo "Enable verbose provision:"
  set -e
  set -x
fi

if [ -z "$DOCKER_PROVISION" ]; then
  echo "Install core dependencies:"
  which git || apt-get install -y git curl

  if [ -n "$TEST_ON_WEB_UI" ]; then
    echo "Install test dependencies:"
    apt-get -y update
    which xvfb || apt-get install -y xvfb
    which firefox || apt-get install -y firefox
    which chromium-browser || apt-get install -y chromium-browser

    echo "Enable xvfb server:"
    Xvfb :1 -screen 5 1024x768x8 &
    export DISPLAY=:1.5
  fi

  echo "Setup on-web-ui temporary folder:"
  mkdir -p /tmp/on-web-ui

  echo "Install and source NVM:"
  [ -f /tmp/nvm/nvm.sh ] ||
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | NVM_DIR=/tmp/nvm bash
  nvm || . /tmp/nvm/nvm.sh

  [ -z "$NODE_VERSION" ] && NODE_VERSION="0.12.5"
  CURRENT_NODE=`nvm current`
  if [ "v$NODE_VERSION" == "$CURRENT_NODE" ]; then
    echo "Node v$NODE_VERSION is current."
  else
    echo "Install v$NODE_VERSION:"
    nvm install "v$NODE_VERSION"
    nvm use "$NODE_VERSION"
    nvm alias default "$NODE_VERSION"
  fi

  echo "Install global npm dependencies:"
  npm install -g gulp slush karma-cli
fi

echo "Detect on-web-ui source:"
if [ -z "$JENKINS_PROVISION" ]; then
  if [ -n "$VAGRANT_PROVISION" ]; then
    echo "Copy on-web-ui from vagrant mount:"
    cp -R /vagrant/* /tmp/on-web-ui
    cd /tmp/on-web-ui
  else
    if [ -f /tmp/on-web-ui/package.json ]; then
      echo "Update on-web-ui:"
      cd /tmp/on-web-ui
      git pull origin master
    else
      echo "Download on-web-ui:"
      cd /tmp
      git clone ssh://git@hwstashprd01.isus.emc.com:7999/onrack/on-web-ui.git
      cd /tmp/on-web-ui
    fi
  fi
else
  echo "Jenkins already checked out on-web-ui from git."
fi

if [ -n "$DOCKER_PROVISION" ]; then
  echo "Build docker container:"
  docker build -t on-web-ui .

  echo "Run docker container:"
  docker run on-web-ui
else
  echo "Install on-web-ui:"
  rm -rf node_modules
  npm install

  if [ -n "$TEST_ON_WEB_UI" ]; then
    echo "Lint on-web-ui:"
    node_modules/.bin/eslint \
      gulpfile.js karma.*conf.js apps scripts/gen* scripts/lib \
      scripts/tasks scripts/test scripts/tools scripts/slushfile.js \
      -f checkstyle -o checkstyle-result.xml || true

    echo "Test on-web-ui:"
    karma start karama.ci.conf.js || true
  fi

  if [ -n "$DEPLOY_ON_WEB_UI" ]; then
    echo "Build on-web-ui:"
    gulp build

    echo "Deploy on-web-ui:"
    gulp deploy || true
  fi

  if [ -n "$RUN_ON_WEB_UI" ]; then
    echo "Run on-web-ui:"
    nohup bash -c "node scripts/tools/code_server.js &"
    nohup bash -c "gulp &"
  fi
fi
