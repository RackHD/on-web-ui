'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';

@radium
@mixin.decorate(DeveloperHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    style: PropTypes.any
  },

  defaultProps: {
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
      <span
          className={this.props.className}
          style={this.props.style}>
      </span>
    );
  }

}
