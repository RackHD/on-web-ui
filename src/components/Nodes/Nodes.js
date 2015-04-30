'use strict';

import './Nodes.less';
import React, { Component, PropTypes } from 'react'; // eslint-disable-line no-unused-vars

import NodeActions from '../../actions/NodeActions';

class Nodes extends Component {

  static propTypes = {
    // body: PropTypes.string.isRequired
  }

  state = {
    nodes: null
  }

  componentDidMount() {
    NodeActions.requestNodes()
      .then(nodes => this.setState({nodes: nodes}))
      .catch(err => this.setState({error: err.stack || err}));
  }

  render() {
    return (
      <div className="Nodes">
        <div>{this.state.error ? JSON.stringify(this.state.error) : 'NO-ERROR'}</div>
        <div>{this.state.nodes ? JSON.stringify(this.state.nodes) : 'NO-NODES'}</div>
      </div>
    );
  }

}

export default Nodes;
