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
import NodeActions from '../../actions/NodeActions';
import './Nodes.less';

@mixin.decorate(FormatHelpers)
class Nodes extends Component {

  // static propTypes = {
  //   body: PropTypes.string.isRequired
  // };

  state = {
    nodes: null
  };

  componentDidMount() {
    NodeActions.requestNodes()
      .then(nodes => this.setState({nodes: nodes}))
      .catch(err => console.error(err));
  }

  render() {
    var nodes = <p>No nodes</p>;
    if (this.state.nodes) {
      nodes = this.state.nodes.map(node => ({
        ID: this.shortId(node.id),
        Name: node.name,
        Created: this.fromNow(node.createdAt),
        Updated: this.fromNow(node.updatedAt),
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
