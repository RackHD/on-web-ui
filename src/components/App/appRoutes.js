'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Route, // Redirect,
         DefaultRoute } from 'react-router';

import App from './App';
import Nodes from '../Nodes';
import Workflows from '../Workflows';
import Dashboard from '../Dashboard';

/** Routes: https://github.com/rackt/react-router/blob/master/docs/api/components/Route.md
  *
  * Routes are used to declare your view hierarchy.
  *
  * Say you go to http://material-ui.com/#/components/paper
  * The react router will search for a route named 'paper' and will recursively render its
  * handler and its parent handler like so: Paper > Components > Master
  */
let appRoutes = (
  <Route name="root" path="/" handler={App}>
    <Route name="dash" handler={Dashboard} />
    <Route name="workflows" handler={Workflows} />
    <Route name="nodes" handler={Nodes} />
    <DefaultRoute handler={Dashboard}/>
  </Route>
);

// <Route name="customization" handler={Customization}>
//   <Route name="colors" handler={Colors} />
//   <Route name="themes" handler={Themes} />
//   <Route name="inline-styles" handler={InlineStyles} />
//   <Redirect from="/customization" to="themes" />
// </Route>
//
// <Route name="components" handler={Components}>
//   <Route name="appbar" handler={AppBar} />
//   <Route name="buttons" handler={Buttons} />
// </Route>

export default appRoutes;
