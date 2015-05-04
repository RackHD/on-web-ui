'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import mixin from 'react-mixin'; // eslint-disable-line no-unused-vars

import {
    TextField
  } from 'material-ui';

import FormatHelpers from '../mixins/FormatHelpers'; // eslint-disable-line no-unused-vars
// import NodeActions from '../../actions/NodeActions';

@mixin.decorate(FormatHelpers)
class Node extends Component {

  state = {
    node: null
  };

  // TODO: make mixin for this
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
            <TextField valueLink={nameLink} hintText="Name" floatingLabelText="Name" />
          </div>
          <div className="one-half column">
            <TextField valueLink={profileLink} hintText="Profile" floatingLabelText="Profile" />
          </div>
        </div>
        {JSON.stringify(this.state.node)}
      </div>
    );
  }

}

export default Node;
