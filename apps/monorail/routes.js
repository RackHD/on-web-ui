// Copyright 2015, EMC, Inc.

'use strict';

import React from 'react';
import { render } from 'react-dom';

import Router, { Route, Redirect, IndexRoute } from 'react-router';
import { createHashHistory, useBasename } from 'history'

import onReady from 'common-web-ui/lib/onReady';

import { Divider, Menu, MenuItem } from 'material-ui';

import AppContainer from 'common-web-ui/views/AppContainer';
import NotFound from 'common-web-ui/views/NotFound';

export var navigation = (
  <Menu>
    <MenuItem><a href="#">Dashboard</a></MenuItem>
    <MenuItem><a href="#/workflow_editor">Workflow Editor</a></MenuItem>
    {/*<MenuItem><a href="#/network_topology">Network Topology</a></MenuItem>*/}
    <MenuItem><h4>Main Resources</h4></MenuItem>
    <Divider />
    <MenuItem><a href="#/catalogs">Catalogs</a></MenuItem>
    <MenuItem><a href="#/nodes">Nodes</a></MenuItem>
    <MenuItem><a href="#/pollers">Pollers</a></MenuItem>
    <MenuItem><a href="#/workflows">Workflows</a></MenuItem>
    <MenuItem><h4>Other Resources</h4></MenuItem>
    <Divider />
    <MenuItem><a href="#/files">Files</a></MenuItem>
    <MenuItem><a href="#/obms">OBM Services</a></MenuItem>
    <MenuItem><a href="#/profiles">Profiles</a></MenuItem>
    <MenuItem><a href="#/skus">Skus</a></MenuItem>
    <MenuItem><a href="#/templates">Templates</a></MenuItem>
    <MenuItem><a href="#/config">Config</a></MenuItem>
    <MenuItem><a href="#/logs"Logs></a></MenuItem>
  </Menu>
);

// Must be imported after navigation.
import AllLogs from './views/AllLogs';
import App from './views/App';
import Catalog from './views/catalogs/Catalog';
import Catalogs from './views/catalogs/Catalogs';
import Config from './views/Config';
import Dashboard from './views/Dashboard';
import File, { CreateFile } from './views/files/File';
import Files from './views/files/Files';
import Node, { CreateNode } from './views/nodes/Node';
import Nodes from './views/nodes/Nodes';
import OBMService from './views/obms/OBMService';
import OBMServices from './views/obms/OBMServices';
import Poller, { CreatePoller } from './views/pollers/Poller';
import Pollers from './views/pollers/Pollers';
import Profile, { CreateProfile } from './views/profiles/Profile';
import Profiles from './views/profiles/Profiles';
import Sku, { CreateSku } from './views/skus/Sku';
import Skus from './views/skus/Skus';
import Template, { CreateTemplate } from './views/templates/Template';
import Templates from './views/templates/Templates';
import Workflow, { CreateWorkflow } from './views/workflows/Workflow';
import Workflows from './views/workflows/Workflows';

import WorkflowEditor from 'workflow-editor-web-ui/views/WorkflowEditor';
import NetworkTopology from 'network-topology-web-ui/views/NetworkTopology';

// See http://rackt.github.io/react-router/
let routes = (
  <Route name="MonoRail" path="/" component={App}>
    <IndexRoute name="Dashboard" component={Dashboard}/>

    <Route name="Workflow Editor" path="/workflow_editor/:workflow" component={WorkflowEditor} />
    <Route name="Workflow Editor" path="/workflow_editor" component={WorkflowEditor} />

    {/*<Route name="Network Topology" path="/network_topology" component={NetworkTopology} />*/}

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

    <Route name="SKUs" path="/skus" component={Skus} />
    <Route name="New SKU" path="/skus/new" component={CreateSku} />
    <Route name="SKUs" path="/skus/:skuId" component={Sku} />

    <Route name="Templates" path="/templates" component={Templates} />
    <Route name="New Template" path="/templates/new" component={CreateTemplate} />
    <Route name="Templates" path="/templates/:templateId" component={Template} />

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
