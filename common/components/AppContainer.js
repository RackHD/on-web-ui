'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import radium from 'radium';
import decorate from '../lib/decorate';

import MUIContextHelpers from '../mixins/mui/MUIContextHelpers';

import { RouteHandler } from 'react-router';
import { AppCanvas } from 'material-ui';

import ViewportSize from './ViewportSize';
import AppHeader from './AppHeader';
// import AppFooter from './AppFooter';

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
    padding: '74px 10px 10px 10px'
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
    title: PropTypes.string,
    header: PropTypes.any,
    footer: PropTypes.any,
    content: PropTypes.any,
    className: PropTypes.string,
    styles: PropTypes.object,
    navigationItems: PropTypes.array
  },

  defaultProps: {
    title: 'On Web UI',
    header: null,
    footer: null,
    content: null,
    className: '',
    styles: {},
    navigationItems: []
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

          {this.props.header ||
            <AppHeader
                className="header"
                title={this.props.title}
                appBarStyles={styles.header}
                navigationItems={this.props.navigationItems} />}

          <div
              className="content"
              style={[defaultStyles.content, styles.content]}>

            {this.props.content || this.props.children || <RouteHandler />}
          </div>

          <div
              className="footer"
              style={[defaultStyles.footer, styles.footer]}>

            {this.props.footer || <div>
              <span>© 2015 EMC<sup>2</sup></span>
              <ViewportSize className="right" />
            </div>}
          </div>

        </AppCanvas>
      </div>
    );
  }

}
