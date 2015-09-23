// Copyright 2015, EMC, Inc.

'use strict';

var express = require('express');

var server = express();

var superagent = require('superagent');

server.set('port', 2000);

var api = 'http://137.69.148.136/rest/v1/';

var methods = {
  GET: 'get',
  POST: 'post'
};

server.get('*', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  var agent = superagent[methods[req.method]](api + req.url);
  if (req.body) {
    agent.send(req.body);
  }

  agent.end(function (err, agentRes) {
    var response = err || agentRes && JSON.parse(agentRes.text) || '';
    console.log('Proxy Request:', api + req.url);
    if (err) {
      console.error(response.message || response.toString());
    } else {
      console.log(response);
    }
    res.send(response);
  });
});

server.listen(server.get('port'), function() {
  console.log('The server is running at http://localhost:' + server.get('port'));
});
