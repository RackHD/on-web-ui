// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';

import EditProfile from './EditProfile';
import CreateProfile from './CreateProfile';
export { CreateProfile, EditProfile };

import {
    LinearProgress,
    List, ListItem,
    RaisedButton,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import ProfileStore from '../../stores/ProfileStore';

@mixin(DialogHelpers, FormatHelpers)
export default class Profile extends Component {

  profiles = new ProfileStore();

  state = {
    profile: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchProfile = this.profiles.watchOne(this.getProfileId(), 'profile', this);
    this.readProfile();
  }

  componentWillUnmount() { this.unwatchProfile(); }

  render() {
    let profile = this.state.profile || {};
    return (
      <div className="Profile">
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text="Profile Details" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
          </ToolbarGroup>
        </Toolbar>
        <div className="ungrid collapse">
          <div className="line">
            <div className="cell">
              <List>
                <ListItem
                  primaryText={this.fromNow(profile.updatedAt)}
                  secondaryText="Updated" />
              </List>
            </div>
            <div className="cell">
              <List>
                <ListItem
                  primaryText={this.fromNow(profile.createdAt)}
                  secondaryText="Created" />
              </List>
            </div>
          </div>
        </div>
        <EditProfile profile={this.state.profile} />
      </div>
    );
  }

  getProfileId() {
    return this.state.profile && this.state.profile.id ||
    this.props.profileId || this.props.params.profileId;
  }

  readProfile() {
    this.setState({loading: true});
    this.profiles.read(this.getProfileId()).then(() => this.setState({loading: false}));
  }

}
