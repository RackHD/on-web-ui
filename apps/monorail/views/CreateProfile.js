'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditProfile from './EditProfile';
import {} from 'material-ui';

@mixin.decorate(PageHelpers)
export default class CreateProfile extends Component {

  state = {
    profile: null
  };

  componentDidMount() {}

  componentWillUnmount() { }

  render() {
    return (
      <div className="Profile">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'profiles', label: 'Profiles'},
          'Create Profile'
        )}
        <EditProfile profile={{}} />
      </div>
    );
  }

}
