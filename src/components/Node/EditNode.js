'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from '../mixins/DialogHelpers';
import FormatHelpers from '../mixins/FormatHelpers';
import EditorHelpers from '../mixins/EditorHelpers';
import RouteHelpers from '../mixins/RouteHelpers';
import GridHelpers from '../mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    TextField,
    FlatButton,
    RaisedButton
  } from 'material-ui';
import { nodes } from '../../actions/NodeActions';
import JsonEditor from '../JsonEditor';

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
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
            <TextField valueLink={profileLink}
                       hintText="Profile"
                       floatingLabelText="Profile"
                       disabled={this.state.disabled} />
          </div>
        </div>

        <h3>JSON Editor</h3>
        <JsonEditor initialValue={this.state.node}
                    updateParentState={this.updateStateFromJsonEditor.bind(this)}
                    disabled={this.state.disabled}
                    ref="jsonEditor" />
        <div className="buttons container">
          <FlatButton className="button"
                      label="Delete"
                      onClick={this.deleteNode.bind(this)}
                      disabled={this.state.disabled} />
          <FlatButton className="button"
                      label="Clone"
                      onClick={this.cloneNode.bind(this)}
                      disabled={true || this.state.disabled} />

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
      </div>
    );
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({node: stateChange});
  }

  saveNode() {
    this.disable();
    nodes.update(this.state.node.id, this.state.node).then(() => this.enable());
  }

  deleteNode() {
    var id = this.state.node.id;
    this.disable();
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed && nodes.destroy(id).then(() => this.routeBack()));
  }

  resetNode() {
    this.disable();
    nodes.read(this.state.node.id)
      .then(node => this.setState({node: node, disabled: false}));
  }

  cloneNode() {}// TODO

}
