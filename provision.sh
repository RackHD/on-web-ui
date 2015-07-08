!/bin/bash

if [ -n "$VERBOSE_PROVISION" ]; then
  set -e
  set -x
fi

echo "Install core dependencies:"
which git || sudo apt-get install -y git curl

if [ -n "$TEST_ON_WEB_UI" ]; then
  echo "Install test dependencies:"
  which xvfb || sudo apt-get install -y xvfb
  which firefox || sudo apt-get install -y firefox
  which chromium-browser || sudo apt-get install -y chromium-browser

  echo "Enable xvfb server:"
  Xvfb :1 -screen 5 1024x768x8 &
  export DISPLAY=:1.5
fi

echo "Install and source NVM:"
[ -f /usr/local/nvm/nvm.sh ] ||
  sudo bash -c 'curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | NVM_DIR=/usr/local/nvm bash'
sudo chmod -R 777 /usr/local/nvm/
nvm || . /usr/local/nvm/nvm.sh

[ -z "$NODE_VERSION" ] && NODE_VERSION="0.12.5"
CURRENT_NODE=`nvm current`
if [ "v$NODE_VERSION" == "$CURRENT_NODE" ]; then
  echo "Node v$NODE_VERSION is current."
else
  echo "Install v$NODE_VERSION:"
  sudo nvm install "v$NODE_VERSION"
  sudo nvm use "$NODE_VERSION"
  sudo nvm alias default "$NODE_VERSION"
fi

echo "Install global npm dependencies:"
sudo npm install -g gulp slush karma-cli

if [ -z "$JENKINS_PROVISION" ]; then
  if [ -f /on-web-ui/package.json ]; then
    echo "Update on-web-ui:"
    cd /on-web-ui
    sudo git pull origin master
  else
    echo "Download on-web-ui:"
    cd /
    sudo git clone ssh://git@hwstashprd01.isus.emc.com:7999/onrack/on-web-ui.git
    cd /on-web-ui
  fi
  sudo chmod -R 777 /on-web-ui/
else
  echo "Jenkins already checked out on-web-ui."
fi

echo "Install on-web-ui:"
sudo rm -rf node_modules
sudo npm install

if [ -n "$TEST_ON_WEB_UI" ]; then
  echo "Lint on-web-ui:"
  sudo node_modules/.bin/eslint \
    gulpfile.js karma.*conf.js apps scripts/gen* scripts/lib \
    scripts/tasks scripts/test scripts/tools scripts/slushfile.js \
    -f checkstyle -o checkstyle-result.xml || true

  echo "Test on-web-ui:"
  sudo karma start karama.ci.conf.js || true
fi

if [ -n "$RUN_ON_WEB_UI" ]; then
  echo "Run on-web-ui:"
  sudo gulp &
fi
