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

import FormatHelpers from '../mixins/FormatHelpers'; // eslint-disable-line no-unused-vars
import NodesActions from '../../actions/NodesActions';
// import NodeActions from '../../actions/NodeActions';
import './Nodes.less';

@mixin.decorate(FormatHelpers)
class Nodes extends Component {

  state = {
    nodes: null
  };

  componentDidMount() {
    NodesActions.getNodes()
      .then(nodes => this.setState({nodes: nodes}))
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
            <IconButton iconClassName="fa fa-edit" tooltip="Edit Worfklow" touch={true}/>
          </a>
          <IconButton iconClassName="fa fa-remove" tooltip="Remove Workflow" touch={true}/>
        </div>)
      }));
      nodes = <Griddle results={nodes} resultsPerPage={15} />;
    }
    var breadcrumbs = this.props.params ? (
      <div className="breadcrumbs">
        <a href="#/dash">Dashboard</a>
        &nbsp;/&nbsp;Nodes
      </div>
    ) : null;
    return (
      <div className="Nodes">
        {breadcrumbs}
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <h3>
              &nbsp; Nodes &nbsp;
              <span>({this.state.nodes && this.state.nodes.length || 0})</span>
            </h3>
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <span className="mui-toolbar-separator">&nbsp;</span>
            <RaisedButton label="Create Node" primary={true} />
          </ToolbarGroup>
        </Toolbar>
        {nodes}
      </div>
    );
  }

}

export default Nodes;
