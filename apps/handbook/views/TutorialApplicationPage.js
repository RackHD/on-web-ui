'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

@radium
@mixin.decorate(DeveloperHelpers)
@mixin.decorate(PageHelpers)
@mixin.decorate(RouteHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
    style: null
  }
})
export default class TutorialApplicationPage extends Component {

  state = {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className="TutorialApplicationPage container">
        Welcome to the TutorialApplication page.
      </div>
    );
  }

}
