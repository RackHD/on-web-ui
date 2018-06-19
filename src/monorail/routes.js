// Copyright 2015, EMC, Inc.

import React from 'react';
import { render } from 'react-dom';

import { Router, Route, IndexRedirect, hashHistory } from 'react-router';

import onReady from 'src-common/lib/onReady';
import NotFound from 'src-common/views/NotFound';

import ManagementConsole from 'src-management-console/views/ManagementConsole';
import NetworkTopology from 'src-network-topology/views/NetworkTopology';
import OperationsCenter from 'src-operations-center/views/OperationsCenter';
import SKUPacks from 'src-sku-packs/views/SKUPacks';
import VisualAnalytics from 'src-visual-analytics/views/VisualAnalytics';
import WorkflowEditor from 'src-workflow-editor/views/WorkflowEditor';

import MonoRailApp from './views/MonoRailApp';
import Settings from './views/Settings';

const main = () => {
  if (global.isUnitTesting) { return; }

  let container = document.createElement('div');
  container.className = 'react-container';
  document.body.appendChild(container);
  global.monorailContainer = container;

  render((
    <Router history={hashHistory}>
      <Route name="RackHD" path="/" component={MonoRailApp}>
        <IndexRedirect to="/mc/dashboard" />
        {ManagementConsole.routes}
        <Route name="Network Topology" path="/nt" component={NetworkTopology} />
        <Route name="Operations Center" path="/oc" component={OperationsCenter} />
        <Route name="Operations Center" path="/oc/:workflow" component={OperationsCenter} />
        <Route name="SKU Packs" path="/sp" component={SKUPacks} />
        <Route name="Visual Analytics" path="/va" component={VisualAnalytics} />
        <Route name="Workflow Editor" path="/we" component={WorkflowEditor} />
        <Route name="Workflow Editor" path="/we/:workflow" component={WorkflowEditor} />
        <Route name="Settings" path="/settings" component={Settings} />
        <Route name="Not Found" path="*" component={NotFound} />
      </Route>
    </Router>
  ), container);
};

onReady(main);
