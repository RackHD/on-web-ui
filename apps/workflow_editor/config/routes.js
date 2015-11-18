// Copyright 2015, EMC, Inc.

'use strict';

import React from 'react';
import { render } from 'react-dom';
import Router, { Route, Redirect, IndexRoute } from 'react-router';
import onReady from 'common-web-ui/lib/onReady';

// import { MenuItem } from 'material-ui';
import NotFound from 'common-web-ui/views/NotFound';

// Must be imported after navigation.
import App from '../views/App';
import WorkflowEditor from '../views/WorkflowEditor';
import ExampleGraphCanvas from 'graph-canvas-web-ui/views/Example';

// See http://rackt.github.io/react-router/
let routes = (
  <Route name="MonoRail" path="/" component={App}>

    <IndexRoute name="Workflow Editor" component={WorkflowEditor} />

    <Route name="Graph Canvas Example" path="/example" component={ExampleGraphCanvas} />

    <Route name="Workflow Editor" path="/edit/:workflow" component={WorkflowEditor} />

    <Route name="Not Found" path="*" component={NotFound} />

    <Redirect from="/edit" to="/edit/new" />
  </Route>
);

// Run the application when both DOM is ready and page content is loaded
onReady(() => {
  if (global.isTesting) { return; }
  let container = document.createElement('div');
  container.className = 'react-container';
  document.body.appendChild(container);
  render(<Router>{routes}</Router>, container);
});
