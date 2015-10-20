// Copyright 2015, EMC, Inc.

'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs');

var server = express();

server.set('port', (process.env.ONWEBCODE_PORT || 7000));

var publicPath = path.join(__dirname, '..', 'apps');

server.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
server.use(function (req, res, next) {
  var file = path.join(publicPath, req.url);
  fs.stat(file, function (statError, stats) {
    // if (statError) {
    //   return res.status(400).send(statError);
    // }
    if (stats.isDirectory()) {
      fs.readdir(file, function (readError, files) {
        if (readError) {
          return res.status(500).send(readError);
        }
        files = files.map(function (filePath) {
          try {
            var fileStats = fs.statSync(path.join(publicPath, req.url, filePath));
            if (fileStats.isDirectory()) { filePath += '/'; }
          } catch(err) { console.error(err); }
          return filePath;
        });
        res.status(200).send(files);
      });
    }
    else {
      next();
    }
  });
  console.log(req.url);
});
server.use(express.static(publicPath));

server.listen(server.get('port'), function() {
  console.log('server is running at http://localhost:' + server.get('port'));

  if (process.send) {
    process.send('online');
  }
});
