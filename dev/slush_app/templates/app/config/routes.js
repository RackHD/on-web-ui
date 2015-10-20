// Copyright 2015, EMC, Inc.

'use strict';

import React from 'react';
import { render } from 'react-dom';
import Router, { Route, Redirect, IndexRoute } from 'react-router';
import onReady from 'common-web-ui/lib/onReady';

// import { MenuItem } from 'material-ui';
import NotFound from 'common-web-ui/views/NotFound';
import UserLogin from 'common-web-ui/views/UserLogin';

// See http://material-ui.com/#/components/left-nav
export var navigation = [
  { text: 'Login', route: '/' },
  { text: 'Not Found', route: '404' }
];

// Must be imported after navigation.
import App from '../views/App';

// See http://rackt.github.io/react-router/
let routes = (
  <Route path="/" name="root" component={App}>
    <IndexRoute component={UserLogin} />
    <Route path="/not_found" name="404" component={NotFound} />
    <Route path="/login" name="login" component={UserLogin} />
    <Route path="*" component={NotFound} />
    <Redirect from="home" to="/" />
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
