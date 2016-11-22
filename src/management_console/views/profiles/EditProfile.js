// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import {
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import ProfileStore from 'src-common/stores/ProfileStore';

export default class EditProfile extends Component {

  static contextTypes = {router: PropTypes.any};

  profiles = new ProfileStore();

  state = {
    profile: this.props.profile,
    disabled: !this.props.profile,
    loading: !this.props.profile
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile) {
      this.setState({profile: nextProps.profile, loading: false, disabled: false});
    }
  }

  render() {
    let profile = this.state.profile || {};
    return (
      <div className="EditProfile">
        <Toolbar>
          <ToolbarGroup key={0} firstChild={true}>
            <ToolbarTitle text={profile.id ? 'Edit Profile' : 'Create Profile'} />
          </ToolbarGroup>
          <ToolbarGroup key={1} lastChild={true}>
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
        <LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />
        <div style={{padding: '0 10px 10px'}}>
          <TextField
              hintText="Name"
              floatingLabelText="Name"
              disabled={this.state.disabled}
              value={profile.name}
              onChange={e => {
                profile.name = e.target.value;
                this.setState({ profile });
              }}
              fullWidth={true} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Profile Content:</h5>
          <textarea
              disabled={this.state.disabled}
              rows={5}
              cols={40}
              value={profile.contents}
              onChange={e => {
                profile.contents = e.target.value;
                this.setState({ profile });
              }}
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
      this.enable();
      this.setState({loading: false});
      if (isNewProfile) this.context.router.goBack();
    });
  }

  disable() { this.setState({disabled: true}); }

  enable() {
    setTimeout(() => this.setState({disabled: false}), 500);
  }

}
