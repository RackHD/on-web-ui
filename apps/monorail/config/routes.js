// Copyright 2015, EMC, Inc.

'use strict';

import React from 'react';
import { render } from 'react-dom';
import Router, { Route, IndexRoute } from 'react-router';
import onReady from 'common-web-ui/lib/onReady';

import { MenuItem } from 'material-ui';
import NotFound from 'common-web-ui/views/NotFound';

// See http://material-ui.com/#/components/left-nav
export var navigation = [
  { text: 'MonoRail Dashboard', route: '' },
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
  { text: 'Logs', route: 'logs' },
  { text: 'Lookups', route: 'lookups' },
  { text: 'Schemas', route: 'schemas' },
  { text: 'Versions', route: 'versions' },
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
  <Route path="/" name="root" component={App}>
    <IndexRoute component={Dashboard}/>

    <Route path="/catalogs" name="catalogs" component={Catalogs} />
    <Route path="/catalogs/n/:nodeId" component={Catalogs} />
    <Route path="/catalogs/n/:nodeId/s/:source" component={Catalog} />
    <Route path="/catalogs/i/:catalogId" component={Catalog} />
    <Route path="/catalogs/:catalogId" name="catalog" component={Catalog} />

    <Route path="/config" name="config" component={Config} />

    <Route path="/dashboard" name="dashboard" component={Dashboard} />

    <Route path="/files" name="files" component={Files} />
    <Route path="/files/new" name="newFile" component={CreateFile} />
    <Route path="/files/:fileId" name="file" component={File} />

    <Route path="/logs" name="logs" component={AllLogs} />
    <Route path="/lookups" name="lookups" component={Lookups} />

    <Route path="/nodes" name="nodes" component={Nodes} />
    <Route path="/nodes/new" name="newNode" component={CreateNode} />
    <Route path="/nodes/:nodeId" name="node" component={Node} />

    <Route path="/obms" name="obmServices" component={OBMServices} />
    <Route path="/obms/:obmsId" name="obmService" component={OBMService} />

    <Route path="/pollers" name="pollers" component={Pollers} />
    <Route path="/pollers/n/:nodeId" component={Pollers} />
    <Route path="/pollers/new/:nodeId" component={CreatePoller} />
    <Route path="/pollers/new" component={CreatePoller} />
    <Route path="/pollers/:pollerId" name="poller" component={Poller} />

    <Route path="/profiles" name="profiles" component={Profiles} />
    <Route path="/profiles/new" name="newProfile" component={CreateProfile} />
    <Route path="/profiles/:profileId" name="profile" component={Profile} />

    <Route path="/schemas" name="schemas" component={Schemas} />
    <Route path="/schemas/:schemaId" name="schema" component={Schema} />

    <Route path="/skus" name="skus" component={Skus} />
    <Route path="/skus/new" name="newSku" component={CreateSku} />
    <Route path="/skus/:skuId" name="sku" component={Sku} />

    <Route path="/templates" name="templates" component={Templates} />
    <Route path="/templates/new" name="newTemplate" component={CreateTemplate} />
    <Route path="/templates/:templateId" name="template" component={Template} />

    <Route path="/versions" name="versions" component={Versions} />

    <Route path="/workflows" name="workflows" component={Workflows} />
    <Route path="/workflows/n/:nodeId" component={Workflows} />
    <Route path="/workflows/new/:nodeId" component={CreateWorkflow} />
    <Route path="/workflows/new" component={CreateWorkflow} />
    <Route path="/workflows/:workflowId" name="workflow" component={Workflow} />

    <Route path="/notFound" name="notFound" component={NotFound} />
    <Route path="*" component={NotFound} />
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
