// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { RaisedButton, LinearProgress } from 'material-ui';

import FormatHelpers from 'src-common/lib/FormatHelpers';
import ResourceTable from 'src-common/views/ResourceTable';
import ProfileStore from 'src-common/stores/ProfileStore';

export default class ProfilesGrid extends Component {

  static contextTypes = {router: PropTypes.any};

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
          loadingContent={<LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />}
          toolbarContent={<RaisedButton label="Create Profile" primary={true} onClick={this.createProfile.bind(this)} />}
          mapper={profile => (
            {
              ID: <Link to={'/mc/profiles/' + profile.name}>{FormatHelpers.shortId(profile.id)}</Link>,
              Name: profile.name,
              Created: FormatHelpers.fromNow(profile.createdAt),
              Updated: FormatHelpers.fromNow(profile.updatedAt)
            }
          )} />
    );
  }

  listProfiles() {
    this.setState({loading: true});
    this.profiles.list().then(() => this.setState({loading: false}));
  }

  createProfile() {
    this.context.router.push('/mc/profiles/new');
  }

}
