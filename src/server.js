'use strict';

import _ from 'lodash';
import express from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';

var server = express();

server.set('port', (process.env.PORT || 5000));
server.use(express.static(path.join(__dirname)));

// Server-side rendering
// -----------------------------------------------------------------------------

// The top-level React component
var AppComponent = React.createFactory(require('./components/App'));

// Main HTML template
var templateFile = path.join(__dirname, 'templates/index.html'),
    template = _.template(fs.readFileSync(templateFile, 'utf8'));

server.get('*', function(req, res) {
  var app = new AppComponent();

  var html = template({
    body: React.renderToString(app),
    description: '',
    title: 'OnRack Web UI'
  });

  res.send(html);
});

server.listen(server.get('port'), function() {
  if (process.send) {
    process.send('online');
  }

  else {
    console.log('The server is running at http://localhost:' + server.get('port'));
  }
});
