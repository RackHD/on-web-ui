# Copyright 2015, EMC, Inc.

# NPM link material-ui
cd ~/Source/material-ui
npm link

# NOTE: Having two different reacts causes things to break.
# In order to work around this problem the version of react from
# on-web-ui will be used in custom material-ui source.
rm -rf ~/Source/material-ui/node_modules/react
ln -s ~/Source/on-web-ui/node_modules/react ~/Source/material-ui/node_modules/react

# Create link to custom material-ui in on-web-ui node_modules
cd ~/Source/on-web-ui
npm link material-ui
