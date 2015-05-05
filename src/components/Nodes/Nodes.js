'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import mixin from 'react-mixin'; // eslint-disable-line no-unused-vars

import Griddle from 'griddle-react';
import {
    IconButton,
    Toolbar,
    ToolbarGroup,
    RaisedButton
  } from 'material-ui';

import Breadcrumbs from '../Breadcrumbs';
import FormatHelpers from '../mixins/FormatHelpers'; // eslint-disable-line no-unused-vars
import NodesActions from '../../actions/NodesActions';
import NodeActions from '../../actions/NodeActions';
import './Nodes.less';

@mixin.decorate(FormatHelpers)
class Nodes extends Component {

  state = {
    nodes: null
  };

  componentDidMount() {
    this.getNodes();
  }

  getNodes() {
    NodesActions.getNodes()
      .then(nodes => this.setState({nodes: nodes}))
      .catch(err => console.error(err));
  }

  deleteNode(id) {
    if (!window.confirm('Are you sure want to delete: ' + id)) { // eslint-disable-line no-alert
      return;
    }
    NodeActions.deleteNode(id)
      .then(out => {
        console.log(out);
        this.getNodes();
      })
      .catch(err => console.error(err));
  }

  render() {
    var nodes = <p>No nodes</p>;
    if (this.state.nodes) {
      nodes = this.state.nodes.map(node => ({
        ID: <a href={'#/nodes/' + node.id}>{this.shortId(node.id)}</a>,
        Name: node.name,
        Created: this.fromNow(node.createdAt),
        Updated: this.fromNow(node.updatedAt),
        Actions: (<div>
          <a href={'#/nodes/' + node.id}>
            <IconButton iconClassName="fa fa-edit" tooltip="Edit Worfklow" touch={true} />
          </a>
          <IconButton iconClassName="fa fa-remove" tooltip="Remove Workflow" touch={true}
                      onClick={this.deleteNode.bind(this, node.id)} />
        </div>)
      }));
      nodes = <Griddle results={nodes} resultsPerPage={10} />;
    }
    var breadcrumbs = this.props.params ? (
      <Breadcrumbs>
        <a href="#/dash">Dashboard</a>
        &nbsp;/&nbsp;Nodes
      </Breadcrumbs>
    ) : null;
    return (
      <div className="Nodes">
        {breadcrumbs}
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <h3 style={{display: 'inline-block'}}>
              &nbsp; <a href="#/nodes">Nodes</a> &nbsp;
              <span>({this.state.nodes && this.state.nodes.length || 0})</span>
            </h3>
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <span className="mui-toolbar-separator">&nbsp;</span>
            <a href="#/nodes/new">
              <RaisedButton label="Create Node" primary={true} />
            </a>
          </ToolbarGroup>
        </Toolbar>
        <div className="u-cf">
          {nodes}
        </div>
      </div>
    );
  }

}

export default Nodes;
