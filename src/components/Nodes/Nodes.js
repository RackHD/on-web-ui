'use strict';

import moment from 'moment';
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import Griddle from 'griddle-react';
import {
    IconButton,
    Toolbar,
    ToolbarGroup,
    RaisedButton
  } from 'material-ui';

import NodeActions from '../../actions/NodeActions';
import './Nodes.less';

const ellipsis = '\u2026';

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
      .catch(err => console.error(err));
  }

  render() {
    var nodes = <p>No nodes</p>;
    if (this.state.nodes) {
      nodes = this.state.nodes.map(node => ({
        id:
          node.id.substring(0, 2) +
          ellipsis +
          node.id.substring(node.id.length - 4, node.id.length),
        Name: node.name,
        Created: moment(node.createdAt).fromNow(),
        Updated: moment(node.updatedAt).fromNow(),
        Actions: (<div>
          <IconButton iconClassName="fa fa-edit" tooltip="Edit Worfklow" touch={true}/>
          <IconButton iconClassName="fa fa-remove" tooltip="Remove Workflow" touch={true}/>
        </div>)
      }));
      nodes = <Griddle results={nodes} resultsPerPage={15} />;
    }
    return (
      <div className="Nodes">
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
