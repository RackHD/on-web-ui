// Copyright 2015, EMC, Inc.

'use strict';

var express = require('express'),
    serveIndex = require('serve-index'),
    path = require('path');

var server = express();

server.set('port', (process.env.ONWEBUI_PORT || 5000));

var publicPath = path.join(__dirname, '..', '..', 'build');

server.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
server.use(express.static(publicPath));
server.use(serveIndex(publicPath, {'icons': true}));

server.listen(server.get('port'), function() {
  console.log('server is running at http://localhost:' + server.get('port'));

  if (process.send) {
    process.send('online');
  }
});
