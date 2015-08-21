'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    // IconButton,
    RaisedButton,
    LinearProgress
  } from 'material-ui';

import ProfileStore from '../stores/ProfileStore';
let profiles = new ProfileStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class ProfilesGrid extends Component {

  state = {profiles: null};

  componentDidMount() {
    this.unwatchProfiles = profiles.watchAll('profiles', this);
    this.listProfiles();
  }

  componentWillUnmount() { this.unwatchProfiles(); }

  render() {
    return (
      <div className="ProfilesGrid">
        {this.renderGridToolbar({
          label: <a href="#/profiles">Profiles</a>,
          count: this.state.profiles && this.state.profiles.length || 0,
          right:
            <RaisedButton label="Create Profile" primary={true} onClick={this.createProfile.bind(this)} />
        })}
        {this.state.loading ? <LinearProgress mode="indeterminate"  /> : <div className="clearfix"></div>}
        {
          this.renderGrid({
            results: this.state.profiles,
            resultsPerPage: this.props.size || 50
          }, profile => (
            {
              ID: <a href={this.routePath('profiles', profile.name)}>{this.shortId(profile.id)}</a>,
              Name: profile.name,
              Created: this.fromNow(profile.createdAt),
              Updated: this.fromNow(profile.updatedAt)//,
              // Actions: [
              //   <IconButton iconClassName="fa fa-edit"
              //               tooltip="Edit Profile"
              //               touch={true}
              //               onClick={this.editProfile.bind(this, profile.name)} />
              // ]
            }
          ), 'No profiles.')
        }
      </div>
    );
  }

  listProfiles() {
    this.setState({loading: true})
    profiles.list().then(() => this.setState({loading: false}));
  }

  // editProfile(id) { this.routeTo('profiles', id); }

  createProfile() { this.routeTo('profiles', 'new'); }

  // deleteProfile(id) {
  //   this.confirmDialog('Are you sure want to delete: ' + id,
  //     (confirmed) => confirmed && profiles.destroy(id));
  // }

}
