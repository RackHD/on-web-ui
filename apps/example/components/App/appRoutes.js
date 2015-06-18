'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Route, Redirect, NotFoundRoute, DefaultRoute } from 'react-router';

import App from './App';

import UserLogin from 'common-web-ui/components/UserLogin';
import NotFound from 'common-web-ui/components/NotFound';
import GraphCanvas from 'monorail-web-ui/components/GraphCanvas';

export default (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute handler={UserLogin}/>

    <Route name="login" handler={UserLogin} />
    <Route name="404" handler={NotFound} />
    <Route name="canvas" handler={GraphCanvas} />

    <NotFoundRoute handler={NotFound}/>

    <Redirect from="dash" to="/" />
  </Route>
);
