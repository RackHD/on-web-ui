'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import mixin from 'react-mixin'; // eslint-disable-line no-unused-vars

import {
  } from 'material-ui';

import FormatHelpers from '../mixins/FormatHelpers'; // eslint-disable-line no-unused-vars
import NodeActions from '../../actions/NodeActions';
import NodeForm from './NodeForm';
import './Node.less';

@mixin.decorate(FormatHelpers)
class Node extends Component {

  state = {
    node: null
  };

  componentDidMount() {
    NodeActions.getNode(this.props.params.nodeId)
      .then(node => this.setState({node: node}))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="Node">
        <div className="breadcrumbs">
          <a href="#/dash">Dashboard</a>
          &nbsp;/&nbsp;
          <a href="#/nodes">Nodes</a>
          {this.state.node ? ' / ' + this.state.node.id : ''}
        </div>
        <NodeForm nodeRef={this.state.node} />
      </div>
    );
  }

}

export default Node;
