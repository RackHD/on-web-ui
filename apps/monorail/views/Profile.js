// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditProfile from './EditProfile';
import CreateProfile from './CreateProfile';
export { CreateProfile, EditProfile };

import {
    LinearProgress,
    List, ListItem,
    RaisedButton,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle,
    Snackbar
  } from 'material-ui';

import ProfileStore from '../stores/ProfileStore';
let profiles = new ProfileStore();

@mixin(DialogHelpers)
@mixin(FormatHelpers)
@mixin(PageHelpers)
export default class Profile extends Component {

  state = {
    profile: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchProfile = profiles.watchOne(this.getProfileId(), 'profile', this);
    this.readProfile();
  }

  componentWillUnmount() { this.unwatchProfile(); }

  render() {
    let profile = this.state.profile || {};
    return (
      <div className="Profile">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'profiles', label: 'Profiles'},
          this.props.params.profileId
        )}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text="Profile Details" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
          </ToolbarGroup>
        </Toolbar>
        <div className="ungrid">
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
    profiles.read(this.getProfileId()).then(() => this.setState({loading: false}));
  }

}
