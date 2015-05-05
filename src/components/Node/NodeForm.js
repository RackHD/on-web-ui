'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import mixin from 'react-mixin'; // eslint-disable-line no-unused-vars

import {
    TextField,
    FlatButton,
    RaisedButton
  } from 'material-ui';

import FormatHelpers from '../mixins/FormatHelpers'; // eslint-disable-line no-unused-vars
import NodeActions from '../../actions/NodeActions';
import JsonEditor from '../JsonEditor';

@mixin.decorate(FormatHelpers)
class Node extends Component {

  state = {
    node: null,
    disabled: false
  };

  disable() { this.setState({disabled: true}); }

  enable() { setTimeout(() => this.setState({disabled: false}), 500); }

  saveNode() {
    this.disable();
    NodeActions.patchNode(this.state.node.id, this.state.node)
      .then(out => {
        console.log(out);
        this.resetNode();
      })
      .catch(err => console.error(err));
  }

  deleteNode() {
    if (!window.confirm('Are you sure want to delete node: ' + this.state.node.id)) { // eslint-disable-line no-alert
      return;
    }
    this.disable();
    NodeActions.deleteNode(this.state.node.id)
      .then(out => {
        console.log(out);
        window.location = '/#/nodes';
      })
      .catch(err => console.error(err));
  }

  resetNode() {
    this.disable();
    NodeActions.getNode(this.state.node.id)
      .then(node => {
        this.setState({node: node});
        this.enable();
      })
      .catch(err => console.error(err));
  }

  // TODO: make mixin for this
  //       this is a custom version of linkState that works with a nested object
  linkState(stateKey, key) {
    var obj = this.state[stateKey];
    return {
      value: obj && obj[key] || null,
      requestChange: (value) => {
        var change = {};
        if (obj) {
          obj[key] = value;
          change[stateKey] = obj;
        }
        else {
          change[stateKey] = {};
          change[stateKey][key] = value;
        }
        this.setState(change);
      }
    };
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({node: stateChange});
  }

  render() {
    if (!this.state.node) {
      this.state.node = this.props.isNew ? {} : this.props.nodeRef || null;
    }
    var nameLink = this.linkState('node', 'name'),
        profileLink = this.linkState('node', 'profile');
    return (
      <div className="NodeForm container">
        <div className="row">
          <div className="one-half column">
            <TextField valueLink={nameLink} hintText="Name" floatingLabelText="Name" disabled={this.state.disabled} />
          </div>
          <div className="one-half column">
            <TextField valueLink={profileLink} hintText="Profile" floatingLabelText="Profile" disabled={this.state.disabled} />
          </div>
        </div>
        <h3>JSON Editor</h3>
        <JsonEditor initialValue={this.state.node}
                    updateParentState={this.updateStateFromJsonEditor.bind(this)}
                    disabled={this.state.disabled}
                    ref="jsonEditor" />
        <div className="buttons container">
          <FlatButton className="button" label="Delete" onClick={this.deleteNode.bind(this)} disabled={this.state.disabled} />
          <div className="u-right">
            <RaisedButton className="button" label="Reset" onClick={this.resetNode.bind(this)} disabled={this.state.disabled} />
            <RaisedButton className="button" label="Save" primary={true} onClick={this.saveNode.bind(this)} disabled={this.state.disabled} />
          </div>
        </div>
      </div>
    );
  }

}

export default Node;
