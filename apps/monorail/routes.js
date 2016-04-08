// Copyright 2015, EMC, Inc.

'use strict';

import React from 'react';
import { render } from 'react-dom';

import { Router, Route, IndexRedirect, hashHistory } from 'react-router';

import onReady from 'rui-common/lib/onReady';
import NotFound from 'rui-common/views/NotFound';
import RackHDRestAPIv2_0 from 'rui-common/messengers/RackHDRestAPIv2_0';

import ManagementConsole from 'rui-management-console/views/ManagementConsole';
import NetworkTopology from 'rui-network-topology/views/NetworkTopology';
import OperationsCenter from 'rui-operations-center/views/OperationsCenter';
import VisualAnalytics from 'rui-visual-analytics/views/VisualAnalytics'
import WorkflowEditor from 'rui-workflow-editor/views/WorkflowEditor';

import MonoRailApp from './views/MonoRailApp'
import Settings from './views/Settings';

const main = () => {
  if (global.isTesting) { return; }

  let container = document.createElement('div');
  container.className = 'react-container';
  document.body.appendChild(container);

  render((
    <Router history={hashHistory}>
      <Route name="RackHD" path="/" component={MonoRailApp}>
        <IndexRedirect to="/mc/dashboard" />
        {ManagementConsole.routes}
        <Route name="Network Topology" path="/nt" component={NetworkTopology} />
        <Route name="Operations Center" path="/oc" component={OperationsCenter} />
        <Route name="Operations Center" path="/oc/:workflow" component={OperationsCenter} />
        <Route name="Visual Analytics" path="/va" component={VisualAnalytics} />
        <Route name="Workflow Editor" path="/we" component={WorkflowEditor} />
        <Route name="Workflow Editor" path="/we/:workflow" component={WorkflowEditor} />
        <Route name="Settings" path="/settings" component={Settings} />
        <Route name="Settings" path="/settings/help" component={Settings} />
        <Route name="Not Found" path="*" component={NotFound} />
      </Route>
    </Router>
  ), container);
};

onReady(() => {
  RackHDRestAPIv2_0.then(main).catch(main);
});
