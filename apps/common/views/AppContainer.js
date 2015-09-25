// Copyright 2015, EMC, Inc.

'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import radium from 'radium';
import decorate from '../lib/decorate';
import MUIContextHelpers from '../mixins/MUIContextHelpers';

import { RouteHandler } from 'react-router';
import { AppCanvas, Snackbar } from 'material-ui';
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
@mixin(MUIContextHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    navigation: PropTypes.array,
    header: PropTypes.any,
    footer: PropTypes.any,
    styles: PropTypes.object,
    title: PropTypes.string
  },

  defaultProps: {
    className: '',
    navigation: [],
    header: undefined,
    footer: undefined,
    styles: {},
    title: 'On Web UI'
  },

  childContextTypes: MUIContextHelpers.muiContextTypes()
})
export default class AppContainer extends Component {

  state = {};

  getChildContext() { return this.muiContext(); }

  componentWillMount() {
    this.handleError = this.onError.bind(this)
    window.onerror = this.handleError;
  }

  componentWillUnmount() {
    window.onerror = null;
  }

  componentDidUpdate() {
    if (this.state.error) { this.refs.error.show(); }
  }

  render() {
    var styles = this.props.styles,
        header = this.props.header,
        footer = this.props.footer;

    if (header === undefined) {
      header = <AppHeader
        className="header"
        navigation={this.props.navigation}
        style={[defaultStyles.header, styles.header]}
        title={this.props.title} />;
    }

    if (footer === undefined) {
      footer = <AppFooter
          className="footer"
          style={[defaultStyles.footer, styles.footer]} />;
    }

    return (
      <div
          className={this.props.className}
          style={[defaultStyles.root, styles.root]}>
        <AppCanvas
            predefinedLayout={1}>
          {header}
          <div
              className="content"
              style={[defaultStyles.content, styles.content]}>
            <Snackbar
              ref="error"
              action="dismiss"
              message={this.state.error || 'Unknown error.'}
              onActionTouchTap={this.dismissError.bind(this)} />
            {this.props.children || <RouteHandler />}
          </div>
          {footer}
        </AppCanvas>
      </div>
    );
  }

  onError(errorMsg) {
    this.showError(errorMsg);
  }

  showError(error) { this.setState({error: error.message || error || 'Unknown Error'}); }

  dismissError() {
    this.refs.error.dismiss();
    this.setState({error: null});
  }

}
