'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditProfile from './EditProfile';
import CreateProfile from './CreateProfile';
export { CreateProfile, EditProfile };

import {} from 'material-ui';

import ProfileStore from '../stores/ProfileStore';
let profiles = new ProfileStore();

@mixin.decorate(PageHelpers)
export default class Profile extends Component {

  state = {
    profile: null
  };

  componentDidMount() {
    this.unwatchProfile = profiles.watchOne(this.getProfileId(), 'profile', this);
    this.readProfile();
  }

  componentWillUnmount() { this.unwatchProfile(); }

  render() {
    return (
      <div className="Profile">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'profiles', label: 'Profiles'},
          this.props.params.profileId
        )}
        <EditProfile profileRef={this.state.profile} />
      </div>
    );
  }

  getProfileId() { return this.props.params.profileId; }

  readProfile() { profiles.read(this.getProfileId()); }

}
