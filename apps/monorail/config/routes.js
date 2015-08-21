'use strict';

import React from 'react';
import Router, { Route, Redirect, NotFoundRoute, DefaultRoute } from 'react-router';
import onReady from 'common-web-ui/lib/onReady';

import { MenuItem } from 'material-ui';
import NotFound from 'common-web-ui/views/NotFound';

// See http://material-ui.com/#/components/left-nav
export var navigation = [
  { text: 'MonoRail API', type: MenuItem.Types.LINK, payload: '/docs', target: '_blank'  },
  { text: 'MonoRail Dashboard', route: '/' },
  { text: 'Workflow Editor', type: MenuItem.Types.LINK, payload: '/workflow_editor', target: '_blank' },
  { text: 'Resources', type: MenuItem.Types.SUBHEADER },
  { text: 'Catalogs', route: 'catalogs' },
  { text: 'Files', route: 'files' },
  { text: 'Nodes', route: 'nodes' },
  { text: 'OBM Services', route: 'obmServices' },
  { text: 'Pollers', route: 'pollers' },
  { text: 'Profiles', route: 'profiles' },
  { text: 'Skus', route: 'skus' },
  { text: 'Templates', route: 'templates' },
  { text: 'Workflows', route: 'workflows' },
  { text: 'System', type: MenuItem.Types.SUBHEADER },
  { text: 'Config', route: 'config' },
  { text: 'Lookups', route: 'lookups' },
  { text: 'Schemas', route: 'schemas' },
  { text: 'Versions', route: 'versions' },
  { text: '', type: MenuItem.Types.SUBHEADER },
  { text: ['© 2015 EMC', <sup>2</sup>], type: MenuItem.Types.LINK, payload: 'http://emc.com', target: '_blank' }
];

// Must be imported after navigation.
import App from '../views/App';
import Catalog from '../views/Catalog';
import Catalogs from '../views/Catalogs';
import Config from '../views/Config';
import Dashboard from '../views/Dashboard';
import File, { CreateFile } from '../views/File';
import Files from '../views/Files';
import Lookups from '../views/Lookups';
import Node, { CreateNode } from '../views/Node';
import Nodes from '../views/Nodes';
import OBMService from '../views/OBMService';
import OBMServices from '../views/OBMServices';
import Poller, { CreatePoller } from '../views/Poller';
import Pollers from '../views/Pollers';
import Profile, { CreateProfile } from '../views/Profile';
import Profiles from '../views/Profiles';
import Schema from '../views/Schema';
import Schemas from '../views/Schemas';
import Sku, { CreateSku } from '../views/Sku';
import Skus from '../views/Skus';
import Template, { CreateTemplate } from '../views/Template';
import Templates from '../views/Templates';
import Versions from '../views/Versions';
import Workflow, { CreateWorkflow } from '../views/Workflow';
import Workflows from '../views/Workflows';

// See http://rackt.github.io/react-router/
let routes = (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute handler={Dashboard}/>

    <Route name="catalogs" handler={Catalogs} />
    <Route name="catalogs/n/:nodeId" handler={Catalogs} />
    <Route name="catalogs/n/:nodeId/s/:source" handler={Catalog} />
    <Route name="catalogI" path="/catalogs/i/:catalogId" handler={Catalog} />
    <Route name="catalog" path="/catalogs/:catalogId" handler={Catalog} />

    <Route name="config" handler={Config} />

    <Route name="dashboard" handler={Dashboard} />

    <Route name="files" handler={Files} />
    <Route name="fileN" path="/files/new" handler={CreateFile} />
    <Route name="file" path="/files/:fileId" handler={File} />

    <Route name="lookups" handler={Lookups} />

    <Route name="nodes" handler={Nodes} />
    <Route name="nodeN" path="/nodes/new" handler={CreateNode} />
    <Route name="node" path="/nodes/:nodeId" handler={Node} />

    <Route name="obmServices" path="/obms" handler={OBMServices} />
    <Route name="obmService" path="/obms/:obmsId" handler={OBMService} />

    <Route name="pollers" handler={Pollers} />
    <Route name="pollerN" path="/pollers/new" handler={CreatePoller} />
    <Route name="poller" path="/pollers/:pollerId" handler={Poller} />

    <Route name="profiles" handler={Profiles} />
    <Route name="profileN" path="/profiles/new" handler={CreateProfile} />
    <Route name="profile" path="/profiles/:profileId" handler={Profile} />

    <Route name="schemas" handler={Schemas} />
    <Route name="schema" path="/schemas/:schemaId" handler={Schema} />

    <Route name="skus" handler={Skus} />
    <Route name="skuN" path="/skus/new" handler={CreateSku} />
    <Route name="sku" path="/skus/:skuId" handler={Sku} />

    <Route name="templates" handler={Templates} />
    <Route name="templateN" path="/templates/new" handler={CreateTemplate} />
    <Route name="template" path="/templates/:templateId" handler={Template} />

    <Route name="versions" handler={Versions} />

    <Route name="workflows" handler={Workflows} />
    <Route name="workflowN" path="/workflows/new" handler={CreateWorkflow} />
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
