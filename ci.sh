# Log in and install these additional packages:
sudo apt-get install ubuntu-desktop # (roland) not sure if this is required?
sudo apt-get install xvfb
sudo apt-get install firefox
sudo apt-get install chromium-browser
sudo apt-get install git

# Setup node and npm using nvm:
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
. ~/.nvm/nvm.sh
nvm install v0.12.5
nvm use 0.12.5

# Install on-web-ui
git clone ssh://git@hwstashprd01.isus.emc.com:7999/onrack/on-web-ui.git
cd on-web-ui
npm install

# Install karma-cli
npm install karma-cli -g

# Setup Xvfb for headless browser support:
Xvfb :1 -screen 5 1024x768x8 &
export DISPLAY=:1.5

# Run karma in ci mode:
. ~/.nvm/nvm.sh && nvm use 0.12.5
git pull && npm install
karma start karma.ci.conf.js
