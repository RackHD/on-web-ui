'use strict';

import React from 'react';
import Router, { Route, Redirect, NotFoundRoute, DefaultRoute } from 'react-router';
import onReady from 'common-web-ui/lib/onReady';

import App from '../views/App';

import NotFound from 'common-web-ui/components/NotFound';
import UserLogin from 'common-web-ui/components/UserLogin';
import GraphCanvas from 'monorail-web-ui/components/GraphCanvas';

let routes = (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute handler={UserLogin} />

    <Route name="404" handler={NotFound} />
    <Route name="login" handler={UserLogin} />
    <Route name="canvas" handler={GraphCanvas} />

    <NotFoundRoute handler={NotFound} />

    <Redirect from="home" to="/" />
  </Route>
);

let params = {
  routes,
  scrollBehavior: Router.ScrollToTopBehavior
};

// Run the application when both DOM is ready and page content is loaded
onReady(() =>
  Router.create(params).run(
    Handler => React.render(<Handler />, document.body)));
