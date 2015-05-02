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

// Main HTML template
var templateFile = path.join(__dirname, 'templates/index.html'),
    template = _.template(fs.readFileSync(templateFile, 'utf8')),
    preload = false; // TODO: fix server side rendering, not sure if this even matters.

server.get('*', function(req, res) {
  if (preload) {
    // The top-level React component
    var AppComponent = React.createFactory(require('./components/App')),
        app = new AppComponent();
  }

  var html = template({
    body: app && React.renderToString(app) || '',
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
