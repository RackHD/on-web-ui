'use strict';

var express = require('express'),
    serveIndex = require('serve-index'),
    path = require('path');

var server = express();

server.set('port', (process.env.ONWEBDOCS_PORT || 6000));

var publicPath = path.join(__dirname, '..', '..', 'apps');

server.use(express.static(publicPath));
server.use(serveIndex(publicPath, {'icons': true}));

server.listen(server.get('port'), function() {
  console.log('server is running at http://localhost:' + server.get('port'));

  if (process.send) {
    process.send('online');
  }
});
