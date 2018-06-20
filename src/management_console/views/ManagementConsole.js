// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import { Route, IndexRedirect } from 'react-router';

import SplitView from 'src-common/views/SplitView';

import Catalog from './catalogs/Catalog';
import Catalogs from './catalogs/Catalogs';
import Config from './Config';
import Dashboard from './Dashboard';
import File, { CreateFile } from './files/File';
import Files from './files/Files';
import Node, { CreateNode } from './nodes/Node';
import Nodes from './nodes/Nodes';
import OBMService from './obms/OBMService';
import OBMServices from './obms/OBMServices';
import Poller, { CreatePoller } from './pollers/Poller';
import Pollers from './pollers/Pollers';
import Profile, { CreateProfile } from './profiles/Profile';
import Profiles from './profiles/Profiles';
import Sku, { CreateSku } from './skus/Sku';
import Skus from './skus/Skus';
import Template, { CreateTemplate } from './templates/Template';
import Templates from './templates/Templates';
import Workflow, { CreateWorkflow } from './workflows/Workflow';
import Workflows from './workflows/Workflows';

import ManagementConsoleToolbar from './ManagementConsoleToolbar';

export default class ManagementConsole extends Component {

  static contextTypes = {
    parentSplit: PropTypes.any
  };

  state = {
    menuSize: 200
  };

  render() {
    let parentSplitView = this.context.parentSplit,
        height = parentSplitView.height * parentSplitView.splitB,
        width = parentSplitView.width;

    return (
      <SplitView
          width={width}
          height={height}
          className="ManagementConsole"
          invert={true}
          ratio={false}
          css={{
            root: {transition: 'width 1s'},
            a: {transition: 'width 1s'},
            b: {transition: 'width 1s, left 1s'},
            resize: {transition: 'width 1s, left 1s'}
          }}
          split={this.state.menuSize}
          onUpdate={splitView => this.setState({menuSize: splitView.state.split})}
          resizable={false}
          collapsable={true}
          a={({ width, height }) => {
            return (
              <div key="mcView" style={{width, height, overflow: 'auto', transition: 'width 1s'}}>
                {this.props.children}
              </div>
            );
          }}
          b={({ width, height }) => {
            return (
              <ManagementConsoleToolbar key="mcToolbar"
                  style={{width, height, overflow: 'auto', transition: 'width 1s'}} />
            );
          }} />
    );
  }

}

ManagementConsole.routes = (
  <Route name="Management Console" path="/mc" component={ManagementConsole}>
    <IndexRedirect to="/mc/dashboard" />

    <Route name="New File" path="/mc/files/new" component={CreateFile} />
    <Route name="New Node Poller" path="/mc/nodes/:nodeId/pollers/new" component={CreatePoller} />
    <Route name="New Node Workflow" path="/mc/nodes/:nodeId/workflows/new" component={CreateWorkflow} />
    <Route name="New Node" path="/mc/nodes/new" component={CreateNode} />
    <Route name="New Poller" path="/mc/pollers/new" component={CreatePoller} />
    <Route name="New Profile" path="/mc/profiles/new" component={CreateProfile} />
    <Route name="New SKU" path="/mc/skus/new" component={CreateSku} />
    <Route name="New Template" path="/mc/templates/new" component={CreateTemplate} />
    <Route name="New Workflow" path="/mc/workflows/new" component={CreateWorkflow} />

    <Route name="Catalogs" path="/mc/catalogs" component={Catalogs} />
    <Route name="Catalog" path="/mc/catalogs/:catalogId" component={Catalog} />

    <Route name="Config" path="/mc/config" component={Config} />

    <Route name="Files" path="/mc/files" component={Files} />
    <Route name="Files" path="/mc/files/:fileId" component={File} />

    <Route name="Dashboard" path="/mc/dashboard" component={Dashboard} />

    <Route name="Node Catalog" path="/mc/nodes/:nodeId/catalogs/:source" component={Catalog} />
    <Route name="Node Catalogs" path="/mc/nodes/:nodeId/catalogs" component={Catalogs} />
    <Route name="Node Pollers" path="/mc/nodes/:nodeId/pollers" component={Pollers} />
    <Route name="Node Workflows" path="/mc/nodes/:nodeId/workflows" component={Workflows} />

    <Route name="Nodes" path="/mc/nodes" component={Nodes} />
    <Route name="Nodes" path="/mc/nodes/:nodeId" component={Node} />

    <Route name="OBM Services" path="/mc/obms" component={OBMServices} />
    <Route name="OBM Services" path="/mc/obms/:obmsId" component={OBMService} />

    <Route name="Pollers" path="/mc/pollers" component={Pollers} />
    <Route name="Pollers" path="/mc/pollers/:pollerId" component={Poller} />

    <Route name="Profiles" path="/mc/profiles" component={Profiles} />
    <Route name="Profiles" path="/mc/profiles/:profileId" component={Profile} />

    <Route name="SKUs" path="/mc/skus" component={Skus} />
    <Route name="SKUs" path="/mc/skus/:skuId" component={Sku} />

    <Route name="Templates" path="/mc/templates" component={Templates} />
    <Route name="Templates" path="/mc/templates/:templateId" component={Template} />

    <Route name="Workflows" path="/mc/workflows" component={Workflows} />
    <Route name="Workflows" path="/mc/workflows/:workflowId" component={Workflow} />
  </Route>
);
