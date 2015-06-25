'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import radium from 'radium';
import decorate from '../lib/decorate';
import MUIContextHelpers from '../mixins/MUIContextHelpers';

import { RouteHandler } from 'react-router';
import { AppCanvas } from 'material-ui';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import emcColors from '../lib/emcColors';

let defaultStyles = {
  root: {},

  header: {
    background: emcColors.mediumGrey.hexString(),
    color: emcColors.offWhite.hexString()
  },

  content: {
    color: emcColors.black.hexString(),
    background: emcColors.white.hexString(),
    padding: '64px 0 0 0'
  },

  footer: {
    color: emcColors.offWhite.hexString(),
    background: emcColors.darkGrey.hexString(),
    padding: '10px'
  }
};

@radium
@mixin.decorate(MUIContextHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    navigation: PropTypes.array,
    styles: PropTypes.object,
    title: PropTypes.string
  },

  defaultProps: {
    className: '',
    navigation: [],
    styles: {},
    title: 'On Web UI'
  },

  childContextTypes: MUIContextHelpers.muiContextTypes()
})
export default class AppContainer extends Component {

  state = {};

  getChildContext() { return this.muiContext(); }

  render() {
    var styles = this.props.styles;

    return (
      <div
          className={this.props.className}
          style={[defaultStyles.root, styles.root]}>

        <AppCanvas
            predefinedLayout={1}>

          <AppHeader
              className="header"
              navigation={this.props.navigation}
              style={[defaultStyles.header, styles.header]}
              title={this.props.title} />

          <div
              className="content"
              style={[defaultStyles.content, styles.content]}>

            {this.props.children || <RouteHandler />}
          </div>

          <AppFooter
              className="footer"
              style={[defaultStyles.footer, styles.footer]} />

        </AppCanvas>
      </div>
    );
  }

}
