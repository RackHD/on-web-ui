'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Route, Redirect, NotFoundRoute, DefaultRoute } from 'react-router';

import App from './App';
import Node from '../Node';
import Nodes from '../Nodes';
import Workflows from '../Workflows';
import Dashboard from '../Dashboard';
import NotFound from '../NotFound';

/** Routes: https://github.com/rackt/react-router/blob/master/docs/api/components/Route.md
  *
  * Routes are used to declare your view hierarchy.
  *
  * Say you go to http://material-ui.com/#/components/paper
  * The react router will search for a route named 'paper' and will recursively render its
  * handler and its parent handler like so: Paper > Components > Master
  */
const appRoutes = (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute handler={Dashboard}/>
    <Route name="dash" handler={Dashboard} />
    <Route name="workflows" handler={Workflows} />
    <Route name="nodes" handler={Nodes} />
    <Route name="node" path="/nodes/:nodeId" handler={Node} />
    <NotFoundRoute handler={NotFound}/>
    <Redirect from="dashboard" to="dash" />
  </Route>
);

export default appRoutes;
