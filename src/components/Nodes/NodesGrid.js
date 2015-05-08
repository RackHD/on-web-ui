'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from '../mixins/DialogHelpers';
import FormatHelpers from '../mixins/FormatHelpers';
import RouteHelpers from '../mixins/RouteHelpers';
import GridHelpers from '../mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    IconButton,
    RaisedButton
  } from 'material-ui';
import NodeAPI from '../../api/NodeAPI';

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class NodesGrid extends Component {

  state = {
    nodes: null
  };

  componentDidMount() { this.getNodes(); }

  render() {
    return (
      <div className="NodesGrid">
        {this.renderGridToolbar({
          label: <a href="#/nodes">Nodes</a>,
          count: this.state.nodes && this.state.nodes.length || 0,
          createButton:
            <RaisedButton label="Create Node" primary={true} onClick={this.createNode.bind(this)} />
        })}
        <div className="clearfix"></div>
        {
          this.renderGrid({
            results: this.state.nodes,
            resultsPerPage: 10
          }, node => (
            {
              ID: <a href={this.routePath('nodes', node.id)}>{this.shortId(node.id)}</a>,
              Name: node.name,
              Created: this.fromNow(node.createdAt),
              Updated: this.fromNow(node.updatedAt),
              Actions: [
                <IconButton iconClassName="fa fa-edit"
                            tooltip="Edit Node"
                            touch={true}
                            onClick={this.editNode.bind(this, node.id)} />,
                <IconButton iconClassName="fa fa-remove"
                            tooltip="Remove Node"
                            touch={true}
                            onClick={this.deleteNode.bind(this, node.id)} />
              ]
            }
          ), 'No nodes.')
        }
      </div>
    );
  }

  getNodes() {
    NodeAPI.getNodes()
      .then(nodes => this.setState({nodes: nodes}))
      .catch(err => console.error(err));
  }

  editNode(id) { this.routeTo('nodes', id); }

  createNode() { this.routeTo('nodes', 'new'); }

  deleteNode(id) {
    this.confirmDialog('Are you sure want to delete: ' + id, (confirmed) => {
      if (!confirmed) { return; }

      NodeAPI.deleteNode(id)
        .then(() => this.getNodes())
        .catch(err => console.error(err));
    });
  }

}
