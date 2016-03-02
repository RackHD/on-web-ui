// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

import mixin from 'rui-common/lib/mixin';
import EditorHelpers from 'rui-common/mixins/EditorHelpers';

import {
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import ProfileStore from 'rui-common/stores/ProfileStore';

@mixin(EditorHelpers)
export default class EditProfile extends Component {

  static contextTypes = {router: PropTypes.any};

  profiles = new ProfileStore();

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
    this.profiles.update(this.state.profile.name, this.state.profile.contents).then(() => {
      this.enable()
      this.setState({loading: false});
      if (isNewProfile) this.context.router.goBack();
    });
  }

}
