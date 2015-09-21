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
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import ProfileStore from '../stores/ProfileStore';
let profiles = new ProfileStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(EditorHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class EditProfile extends Component {

  state = {
    profile: this.props.profile,
    disabled: !this.props.profile,
    loading: !this.props.profile
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile) this.setState({profile: nextProps.profile, loading: false, disabled: false});
  }

  render() {
    var profile = this.state.profile || {},
        nameLink = this.linkObjectState('profile', 'name'),
        contentsLink = this.linkObjectState('profile', 'contents');
    return (
      <div className="EditProfile">
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text={profile.id ? 'Edit File' : 'Create File'} />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <RaisedButton
                label="Cancel"
                onClick={this.routeBack}
                disabled={this.state.disabled} />
            <RaisedButton
                label="Save"
                primary={true}
                onClick={this.saveProfile.bind(this)}
                disabled={this.state.disabled} />
          </ToolbarGroup>
        </Toolbar>
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix" />}
        <div style={{padding: '0 10px 10px'}}>
          <TextField
              valueLink={nameLink}
              hintText="Name"
              floatingLabelText="Name"
              disabled={this.state.disabled}
              fullWidth={true} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Profile Content:</h5>
          <textarea
              valueLink={contentsLink}
              disabled={this.state.disabled}
              rows={5}
              cols={40}
              style={{width: '99%', height: 300}} />
        </div>
      </div>
    );
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({profile: stateChange});
  }

  saveProfile() {
    this.setState({loading: true});
    this.disable();
    let isNewProfile = !this.state.profile.id;
    templates.update(this.state.profile.name, this.state.profile.contents).then(() => {
      this.enable()
      this.setState({loading: false});
      if (isNewProfile) this.routeBack();
    });
  }

}
