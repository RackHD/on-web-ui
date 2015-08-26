'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import EditorHelpers from 'common-web-ui/mixins/EditorHelpers';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
/* eslint-enable no-unused-vars */

import Select from 'react-select';
import {
    TextField,
    FlatButton,
    RaisedButton
  } from 'material-ui';
import JsonEditor from 'common-web-ui/views/JsonEditor';

import NodeStore from '../stores/NodeStore';
let nodes = new NodeStore();

@mixin.decorate(FormatHelpers)
@mixin.decorate(DialogHelpers)
@mixin.decorate(EditorHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class EditNode extends Component {

  state = {
    node: null,
    disabled: false
  };

  render() {
    if (!this.state.node) {
      this.state.node = this.props.nodeRef || null;
    }
    var nameLink = this.linkObjectState('node', 'name'),
        profileLink = this.linkObjectState('node', 'profile');
    return (
      <div className="EditNode container">
        <div className="row">
          <div className="one-half column">
            <TextField valueLink={nameLink}
                       hintText="Name"
                       floatingLabelText="Name"
                       disabled={this.state.disabled} />
          </div>
          <div className="one-half column">
            <label>Type:</label>
            <Select
                name="type"
                value={this.state.node && this.state.node.type}
                placeholder="Select a type..."
                options={[
                  {value: 'compute', label: 'Compute Node'},
                  {value: 'dea', label: 'DEA Node'},
                  {value: 'mgmt', label: 'Management Node'},
                  {value: 'pdu', label: 'PDU Node'},
                  {value: 'switch', label: 'Switch Node'}
                ]}
                onChange={(value) => {
                  let node = this.state.node;
                  node.type = value;
                  this.setState({node: node})
                }} />
          </div>
        </div>

        <h3>JSON Editor</h3>
        <JsonEditor initialValue={this.state.node}
                    updateParentState={this.updateStateFromJsonEditor.bind(this)}
                    disabled={this.state.disabled}
                    ref="jsonEditor" />
        <div className="right">
          <FlatButton className="button"
                      label="Cancel"
                      onClick={this.routeBack}
                      disabled={this.state.disabled} />
          <RaisedButton className="button"
                        label="Reset"
                        onClick={this.resetNode.bind(this)}
                        disabled={this.state.disabled} />
          <RaisedButton className="button"
                        label="Save" primary={true}
                        onClick={this.saveNode.bind(this)}
                        disabled={this.state.disabled} />
        </div>
      </div>
    );
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({node: stateChange});
  }

  saveNode() {
    this.disable();
    if (this.state.node.id) {
      nodes.update(this.state.node.id, this.state.node).then(() => this.enable());
    }
    else {
      nodes.create(this.state.node).then(() => this.routeBack());
    }
  }

  resetNode() {
    this.disable();
    nodes.read(this.state.node.id)
      .then(node => this.setState({node: node, disabled: false}));
  }

}
