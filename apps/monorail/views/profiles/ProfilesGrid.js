// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import { RaisedButton, LinearProgress } from 'material-ui';

import ResourceTable from 'common-web-ui/views/ResourceTable';

import ProfileStore from '../../stores/ProfileStore';

@mixin(FormatHelpers, RouteHelpers)
export default class ProfilesGrid extends Component {

  profiles = new ProfileStore();

  state = {profiles: null};

  componentDidMount() {
    this.unwatchProfiles = this.profiles.watchAll('profiles', this);
    this.listProfiles();
  }

  componentWillUnmount() { this.unwatchProfiles(); }

  render() {
    return (
      <ResourceTable
          initialEntities={this.state.profiles}
          routeName="profiles"
          emptyContent="No profiles."
          headerContent="Profiles"
          loadingContent={this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
          toolbarContent={<RaisedButton label="Create Profile" primary={true} onClick={this.createProfile.bind(this)} />}
          mapper={profile => (
            {
              ID: <a href={this.routePath('profiles', profile.name)}>{this.shortId(profile.id)}</a>,
              Name: profile.name,
              Created: this.fromNow(profile.createdAt),
              Updated: this.fromNow(profile.updatedAt)
            }
          )} />
    );
  }

  listProfiles() {
    this.setState({loading: true})
    this.profiles.list().then(() => this.setState({loading: false}));
  }

  createProfile() { this.routeTo('profiles', 'new'); }

}
