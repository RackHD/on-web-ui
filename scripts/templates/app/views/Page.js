// Copyright 2015, EMC, Inc.

'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'common-web-ui/lib/mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

@radium
@mixin(DeveloperHelpers)
@mixin(PageHelpers)
@mixin(RouteHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    style: PropTypes.any
  },

  defaultProps:{
    className: '',
    style: {}
  }
})
export default class <%= file %> extends Component {

  state = {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className="<%= file %> container"></div>
    );
  }

}
