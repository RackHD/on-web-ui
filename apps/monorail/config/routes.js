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
  { text: 'Workflows', route: 'workflows' },
  { text: 'Tools', type: MenuItem.Types.SUBHEADER },
  { text: 'Workflow Builder', route: 'builder' },
  { text: 'Other', type: MenuItem.Types.SUBHEADER },
  { text: 'EMC', type: MenuItem.Types.LINK, payload: 'http://emc.com' }
];

// Must be imported after navigation.
import App from '../views/App';

import Node, { CreateNode } from '../views/Node';
import Nodes from '../views/Nodes';
import Workflow, { CreateWorkflow } from '../views/Workflow';
import Workflows from '../views/Workflows';
import WorkflowBuilder from '../views/WorkflowBuilder';
import Activities from '../views/Activities';
import Tasks from '../views/Tasks';
import Jobs from '../views/Jobs';
import Dashboard from '../views/Dashboard';


// See http://rackt.github.io/react-router/
let routes = (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute handler={Dashboard}/>
    <Route name="workflows" handler={Workflows} />
    <Route name="newWorkflow" path="/workflows/new" handler={CreateWorkflow} />
    <Route name="workflow" path="/workflows/:workflowId" handler={Workflow} />
    <Route name="nodes" handler={Nodes} />
    <Route name="newNode" path="/nodes/new" handler={CreateNode} />
    <Route name="node" path="/nodes/:nodeId" handler={Node} />
    <Route name="activities" handler={Activities} />
    <Route name="tasks" handler={Tasks} />
    <Route name="jobs" handler={Jobs} />
    <Route name="builder" handler={WorkflowBuilder} />
    <Route name="builder/:workflowId" handler={WorkflowBuilder} />
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
onReady(() =>
  Router.create(params).run(
    Handler => React.render(<Handler />, document.body)));
