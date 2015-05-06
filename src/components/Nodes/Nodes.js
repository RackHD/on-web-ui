'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from '../mixins/DialogHelpers';
import FormatHelpers from '../mixins/FormatHelpers';
import RouteHelpers from '../mixins/RouteHelpers';
import PageHelpers from '../mixins/PageHelpers';
import GridHelpers from '../mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    IconButton,
    RaisedButton
  } from 'material-ui';
import NodesActions from '../../actions/NodesActions';
import NodeActions from '../../actions/NodeActions';
import './Nodes.less';

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(PageHelpers)
@mixin.decorate(GridHelpers)
export default class Nodes extends Component {

  state = {
    nodes: null
  };

  componentDidMount() { this.getNodes(); }

  render() {
    return (
      <div className="Nodes">
        {this.renderBreadcrumbs({href: 'dash', label: 'Dashboard'}, 'Nodes')}
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
    NodesActions.getNodes()
      .then(nodes => this.setState({nodes: nodes}))
      .catch(err => console.error(err));
  }

  editNode(id) { this.routeTo('nodes', id); }

  createNode() { this.routeTo('nodes', 'new'); }

  deleteNode(id) {
    this.confirmDialog('Are you sure want to delete: ' + id, (confirmed) => {
      if (!confirmed) { return; }

      NodeActions.deleteNode(id)
        .then(() => this.getNodes())
        .catch(err => console.error(err));
    });
  }

}
