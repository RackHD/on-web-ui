'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';

import {
  } from 'material-ui';

/**
# WEWorkflowJSON

@object
  @type class
  @extends React.Component
  @name WEWorkflowJSON
  @desc
*/

@radium
@mixin.decorate(DeveloperHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    editor: PropTypes.object,
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
    editor: null,
    style: {}
  }
})
export default class WEWorkflowOutline extends Component {

  state = {};

  componentWillMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div>
        Hello World
      </div>
    );
  }

}
