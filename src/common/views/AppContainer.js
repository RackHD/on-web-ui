// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import { AppCanvas } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ErrorNotification from './ErrorNotification';

import emcTheme from '../lib/emcTheme';

@radium
export default class AppContainer extends Component {

  static defaultProps = {
    css: {}
  };

  static childContextTypes = {
    appContainer: PropTypes.any,
    muiTheme: PropTypes.any
  };

  state = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  getChildContext() {
    return {
      appContainer: this,
      muiTheme: emcTheme
    };
  }

  componentWillMount() {
    this.handleError = this.onError.bind(this);
    window.onerror = this.handleError;
  }

  componentDidMount() {
    this.updateSize = () => {
      this.setState({width: window.innerWidth, height: window.innerHeight});
    };
    window.addEventListener('resize', this.updateSize);
    window.addEventListener('orientationchange', this.updateSize);
  }


  componentWillUnmount() {
    window.onerror = null;
    window.removeEventListener('resize', this.updateSize);
    window.removeEventListener('orientationchange', this.updateSize);
    this.updateSize = null;
  }

  css = {
    root: {
      position: 'relative'
    }
  };

  render() {
    let css = {
      root: [
        this.css.root,
        {width: this.state.width, height: this.state.height},
        this.props.css.root,
        this.props.style
      ]
    };

    return (
      <MuiThemeProvider muiTheme={emcTheme}>
        <div className={this.props.className} style={css.root}>
          {this.props.children}
          <ErrorNotification ref="error" />
        </div>
      </MuiThemeProvider>
    );
  }

  onError(errorMsg, tries=0) {
    if (!this.refs.error) {
      if (tries > 10) { throw new Error(errorMsg); }
      return setTimeout(this.onError.bind(this, errorMsg, tries + 1), 100);
    }
    this.refs.error.showError(errorMsg);
  }

}
