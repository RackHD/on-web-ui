// Copyright 2015, EMC, Inc.

'use strict';

import React from 'react';
import { render } from 'react-dom';

import Router, { Route, Redirect, IndexRoute } from 'react-router';
import { createHashHistory, useBasename } from 'history'

import onReady from 'common-web-ui/lib/onReady';

import { MenuItem } from 'material-ui';

import AppContainer from 'common-web-ui/views/AppContainer';
import NotFound from 'common-web-ui/views/NotFound';

// See http://material-ui.com/#/components/left-nav
export var navigation = [
  { text: 'Nodes', route: 'nodes' },
  { text: 'Workflows', route: 'workflows' },
  { text: 'Workflow Editor', route: 'workflow_editor' },
  { text: 'Resources', type: MenuItem.Types.SUBHEADER },
  { text: 'Catalogs', route: 'catalogs' },
  { text: 'Files', route: 'files' },
  { text: 'OBM Services', route: 'obmServices' },
  { text: 'Pollers', route: 'pollers' },
  { text: 'Profiles', route: 'profiles' },
  { text: 'Skus', route: 'skus' },
  { text: 'Templates', route: 'templates' },
  { text: 'System', type: MenuItem.Types.SUBHEADER },
  { text: 'Config', route: 'config' },
  { text: 'Logs', route: 'logs' },
  // { text: 'Lookups', route: 'Lookups' },
  // { text: 'Schemas', route: 'Schemas' },
  // { text: 'Versions', route: 'versions' },
  { text: '', type: MenuItem.Types.SUBHEADER },
  { text: ['© 2015 EMC', <sup>2</sup>], type: MenuItem.Types.LINK, payload: 'http://emc.com', target: '_blank' }
];

// Must be imported after navigation.
import AllLogs from '../views/AllLogs';
import App from '../views/App';
import Catalog from '../views/Catalog';
import Catalogs from '../views/Catalogs';
import Config from '../views/Config';
import Dashboard from '../views/Dashboard';
import File, { CreateFile } from '../views/File';
import Files from '../views/Files';
// import Lookups from '../views/Lookups';
import Node, { CreateNode } from '../views/Node';
import Nodes from '../views/Nodes';
import OBMService from '../views/OBMService';
import OBMServices from '../views/OBMServices';
import Poller, { CreatePoller } from '../views/Poller';
import Pollers from '../views/Pollers';
import Profile, { CreateProfile } from '../views/Profile';
import Profiles from '../views/Profiles';
// import Schema from '../views/Schema';
// import Schemas from '../views/Schemas';
import Sku, { CreateSku } from '../views/Sku';
import Skus from '../views/Skus';
import Template, { CreateTemplate } from '../views/Template';
import Templates from '../views/Templates';
// import Versions from '../views/Versions';
import Workflow, { CreateWorkflow } from '../views/Workflow';
import Workflows from '../views/Workflows';

import WorkflowEditor from 'workflow-editor-web-ui/views/WorkflowEditor';

// See http://rackt.github.io/react-router/
let routes = (
  <Route name="MonoRail" path="/" component={App}>
    <IndexRoute name="Dashboard" component={Dashboard}/>

    <Route name="Workflow Editor" path="/workflow_editor/:workflow" component={WorkflowEditor} />
    <Redirect from="/workflow_editor" to="/workflow_editor/New Workflow" />
    <Redirect from="/edit/:workflow" to="/workflow_editor/:workflow" />

    <Route name="Catalogs" path="/catalogs" component={Catalogs} />
    <Route path="/catalogs/n/:nodeId" component={Catalogs} />
    <Route path="/catalogs/n/:nodeId/s/:source" component={Catalog} />
    <Route path="/catalogs/i/:catalogId" component={Catalog} />
    <Route name="Catalogs" path="/catalogs/:catalogId" component={Catalog} />

    <Route name="Config" path="/config" component={Config} />

    <Route name="Dashboard" path="/dashboard" component={Dashboard} />

    <Route name="Files" path="/files" component={Files} />
    <Route name="New File" path="/files/new" component={CreateFile} />
    <Route name="Files" path="/files/:fileId" component={File} />

    <Route name="All Logs" path="/logs" component={AllLogs} />
    {/*<Route name="Lookups" path="/lookups" component={Lookups} />*/}

    <Route name="Nodes" path="/nodes" component={Nodes} />
    <Route name="New Node" path="/nodes/new" component={CreateNode} />
    <Route name="Nodes" path="/nodes/:nodeId" component={Node} />

    <Route name="OBM Services" path="/obms" component={OBMServices} />
    <Route name="OBM Services" path="/obms/:obmsId" component={OBMService} />

    <Route name="Pollers" path="/pollers" component={Pollers} />
    <Route path="/pollers/n/:nodeId" component={Pollers} />
    <Route path="/pollers/new/:nodeId" component={CreatePoller} />
    <Route path="/pollers/new" component={CreatePoller} />
    <Route name="Pollers" path="/pollers/:pollerId" component={Poller} />

    <Route name="Profiles" path="/profiles" component={Profiles} />
    <Route name="New Profile" path="/profiles/new" component={CreateProfile} />
    <Route name="Profiles" path="/profiles/:profileId" component={Profile} />

    {/*<Route name="Schemas" path="/schemas" component={Schemas} />
    <Route name="Schemas" path="/schemas/:schemaId" component={Schema} />*/}

    <Route name="SKUs" path="/skus" component={Skus} />
    <Route name="New SKU" path="/skus/new" component={CreateSku} />
    <Route name="SKUs" path="/skus/:skuId" component={Sku} />

    <Route name="Templates" path="/templates" component={Templates} />
    <Route name="New Template" path="/templates/new" component={CreateTemplate} />
    <Route name="Templates" path="/templates/:templateId" component={Template} />

    {/*<Route name="Versions" path="/versions" component={Versions} />*/}

    <Route name="Workflows" path="/workflows" component={Workflows} />
    <Route name="Node Workflows" path="/workflows/n/:nodeId" component={Workflows} />
    <Route name="New Workflow" path="/workflows/new/:nodeId" component={CreateWorkflow} />
    <Route name="New Workflow" path="/workflows/new" component={CreateWorkflow} />
    <Route name="Workflows" path="/workflows/:workflowId" component={Workflow} />

    <Route name="Not Found" path="*" component={NotFound} />
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
