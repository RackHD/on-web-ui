// Copyright 2015, EMC, Inc.

'use strict';

var express = require('express');

var bodyParser = require('body-parser');

var server = express();

var superagent = require('superagent');

server.use(bodyParser.json());

server.set('port', 2000);

var host = 'https://137.69.149.30',
    api = host + '/rest/v1/';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var token = null;

// var login = superagent.post(host + '/login');
// login.accept('json');
// login.type('json');
// login.send(JSON.stringify({email: 'admin', password: 'admin123'}));
// login.end(function (err, agentRes) {
//   var data = JSON.parse(agentRes.text);
//   token = data.response.user.authentication_token;
// });

server.all('*', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authentication-Token');

  var method = req.method.toLowerCase(),
      url = req.url === '/login' ? host + '/login' : api + req.url.substr(1);

  if (url.charAt(url.length - 1) === '/') {
    url = url.substr(0, url.length - 1);
  }

  console.log(method, url);

  var agent = superagent[method](url);

  agent.accept('json');
  agent.type('application/json');

  if (req.url !== 'login') {
    agent.set('Authentication-Token',
      req.headers['Authentication-Token'] ||
      req.headers['authentication-token'] || token);
  }

  if (req.body) {
    agent.send(req.body);
  }

  agent.end(function (err, agentRes) {
    var response;
    try {
      response = err || agentRes && JSON.parse(agentRes.text) || '';
    } catch (_err) {
      err = _err;
      response = err;
    }
    console.log('Proxy Request:', url);
    if (err) {
      console.error(response.message || response.toString());
    }
    else {
      console.log(response);
    }
    res.send(response);
  });
});

server.listen(server.get('port'), function() {
  console.log('The server is running at http://localhost:' + server.get('port'));
});
