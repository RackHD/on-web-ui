'use strict';

import React from 'react';
import Router, { Route, Redirect, NotFoundRoute, DefaultRoute } from 'react-router';
import onReady from 'common-web-ui/lib/onReady';

import { MenuItem } from 'material-ui';
import NotFound from 'common-web-ui/views/NotFound';

// See http://material-ui.com/#/components/left-nav
export var navigation = [
  { text: 'Dashboard', route: '/' },
  { text: 'Objects', type: MenuItem.Types.SUBHEADER },
  { text: 'Nodes', route: 'nodes' },
  { text: 'Lookups', route: 'lookups' },
  { text: 'Other', type: MenuItem.Types.SUBHEADER },
  { text: 'EMC', type: MenuItem.Types.LINK, payload: 'http://emc.com' }
];

// Must be imported after navigation.
import App from '../views/App';

import Node, { CreateNode } from '../views/Node';
import Nodes from '../views/Nodes';
import Lookups from '../views/Lookups';
import Dashboard from '../views/Dashboard';

// See http://rackt.github.io/react-router/
let routes = (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute handler={Dashboard}/>
    <Route name="nodes" handler={Nodes} />
    <Route name="newNode" path="/nodes/new" handler={CreateNode} />
    <Route name="node" path="/nodes/:nodeId" handler={Node} />
    <Route name="lookups" path="/lookups" handler={Lookups} />
    <NotFoundRoute handler={NotFound}/>
    <Redirect from="dash" to="/" />
  </Route>
);

// Router configuration
let params = {
  routes,
  scrollBehavior: Router.ScrollToTopBehavior
};

// Run the application when both DOM is ready and page content is loaded
onReady(() => {
  if (global.isTesting) { return; }
  Router.create(params).run(Handler => {
    React.render(<Handler />, document.body);
  });
});
