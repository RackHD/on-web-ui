'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import EditorHelpers from 'common-web-ui/mixins/EditorHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    TextField,
    FlatButton,
    RaisedButton
  } from 'material-ui';
import JsonEditor from 'common-web-ui/views/JsonEditor';

import PollerStore from '../stores/PollerStore';
let pollers = new PollerStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(EditorHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class EditPoller extends Component {

  state = {
    poller: null,
    disabled: false
  };

  render() {
    if (!this.state.poller) {
      this.state.poller = this.props.pollerRef || null;
    }
    var nameLink = this.linkObjectState('poller', 'name'),
        profileLink = this.linkObjectState('poller', 'profile');
    return (
      <div className="EditPoller container">
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
        <JsonEditor initialValue={this.state.poller}
                    updateParentState={this.updateStateFromJsonEditor.bind(this)}
                    disabled={this.state.disabled}
                    ref="jsonEditor" />
        <div className="buttons container">
          <FlatButton className="button"
                      label="Delete"
                      onClick={this.deletePoller.bind(this)}
                      disabled={this.state.disabled} />
          <FlatButton className="button"
                      label="Clone"
                      onClick={this.clonePoller.bind(this)}
                      disabled={true || this.state.disabled} />

          <div className="right">
            <FlatButton className="button"
                        label="Cancel"
                        onClick={this.routeBack}
                        disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Reset"
                          onClick={this.resetPoller.bind(this)}
                          disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Save" primary={true}
                          onClick={this.savePoller.bind(this)}
                          disabled={this.state.disabled} />
          </div>
        </div>
      </div>
    );
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({poller: stateChange});
  }

  savePoller() {
    this.disable();
    pollers.update(this.state.poller.id, this.state.poller).then(() => this.enable());
  }

  deletePoller() {
    var id = this.state.poller.id;
    this.disable();
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed && pollers.destroy(id).then(() => this.routeBack()));
  }

  resetPoller() {
    this.disable();
    pollers.read(this.state.poller.id)
      .then(poller => this.setState({poller: poller, disabled: false}));
  }

  clonePoller() {}// TODO

}
