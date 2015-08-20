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
  { text: 'Profiles', route: 'profiles' },
  { text: 'Skus', route: 'skus' },
  { text: 'Templates', route: 'templates' },
  { text: 'Workflows', route: 'workflows' },
  { text: 'Other', type: MenuItem.Types.SUBHEADER },
  { text: 'Lookups', route: 'lookups' },
  { text: 'EMC', type: MenuItem.Types.LINK, payload: 'http://emc.com' }
];

// Must be imported after navigation.
import App from '../views/App';

import Dashboard from '../views/Dashboard';
import Lookups from '../views/Lookups';
import Catalog from '../views/Catalog';
import Catalogs from '../views/Catalogs';
import Node, { CreateNode } from '../views/Node';
import Nodes from '../views/Nodes';
import Profile, { CreateProfile } from '../views/Profile';
import Profiles from '../views/Profiles';
import Sku from '../views/Sku';
import Skus from '../views/Skus';
import Template, { CreateTemplate } from '../views/Template';
import Templates from '../views/Templates';
import Workflow from '../views/Workflow';
import Workflows from '../views/Workflows';

// See http://rackt.github.io/react-router/
let routes = (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute handler={Dashboard}/>

    <Route name="dashboard" handler={Dashboard} />
    <Route name="lookups" handler={Lookups} />

    <Route name="catalogs" handler={Catalogs} />
    <Route name="catalogs/n/:nodeId" handler={Catalogs} />
    <Route name="catalogs/n/:nodeId/s/:source" handler={Catalog} />
    <Route name="catalogI" path="/catalogs/i/:catalogId" handler={Catalog} />
    <Route name="catalog" path="/catalogs/:catalogId" handler={Catalog} />

    <Route name="nodes" handler={Nodes} />
    <Route name="newNode" path="/nodes/new" handler={CreateNode} />
    <Route name="node" path="/nodes/:nodeId" handler={Node} />

    <Route name="profiles" handler={Profiles} />
    <Route name="newProfile" path="/profiles/new" handler={CreateProfile} />
    <Route name="profile" path="/profiles/:profileId" handler={Profile} />

    <Route name="skus" handler={Skus} />
    <Route name="sku" path="/skus/:skuId" handler={Sku} />

    <Route name="templates" handler={Templates} />
    <Route name="newTemplate" path="/templates/new" handler={CreateTemplate} />
    <Route name="template" path="/templates/:templateId" handler={Template} />

    <Route name="workflows" handler={Workflows} />
    <Route name="workflow" path="/workflows/:workflowId" handler={Workflow} />

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
