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

import ProfileStore from '../stores/ProfileStore';
let profiles = new ProfileStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(EditorHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class EditProfile extends Component {

  state = {
    profile: null,
    disabled: false
  };

  render() {
    if (!this.state.profile) {
      this.state.profile = this.props.profileRef || null;
    }
    var nameLink = this.linkObjectState('profile', 'name'),
        contentsLink = this.linkObjectState('profile', 'contents');
    return (
      <div className="EditProfile ungrid">
        <div className="line">
          <div className="cell" style={{verticalAlign: 'top'}}>
            <TextField valueLink={nameLink}
                       hintText="Name"
                       floatingLabelText="Name"
                       disabled={this.state.disabled} />
            <br/>
            <label>Content:</label><br/>
            <textarea valueLink={contentsLink}
                      disabled={this.state.disabled}
                      rows={5}
                      cols={40}
                      style={{width: '99%', height: 300}} />
          </div>
          <div className="cell">
            <h3>Raw JSON</h3>
            <JsonEditor initialValue={this.state.profile}
                        updateParentState={this.updateStateFromJsonEditor.bind(this)}
                        disabled={this.state.disabled}
                        ref="jsonEditor" />
          </div>
        </div>

        <div className="buttons container">
          <div className="right">
            <FlatButton className="button"
                        label="Cancel"
                        onClick={this.routeBack}
                        disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Reset"
                          onClick={this.resetProfile.bind(this)}
                          disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Save" primary={true}
                          onClick={this.saveProfile.bind(this)}
                          disabled={this.state.disabled} />
          </div>
        </div>
      </div>
    );
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({profile: stateChange});
  }

  saveProfile() {
    this.disable();
    profiles.update(this.state.profile.name, this.state.profile.contents).then(() => this.enable());
  }

  resetProfile() {
    this.disable();
    profiles.read(this.state.profile.name)
      .then(profile => this.setState({profile: profile, disabled: false}));
  }

  cloneProfile() {}// TODO

}
