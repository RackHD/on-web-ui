// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';
import { RouteHandler, Link } from 'react-router';

import { AppBar, AppCanvas, Snackbar } from 'material-ui';
import ThemeDecorator from 'material-ui/lib/styles/theme-decorator';

import AppNavigation from './AppNavigation';
import EMCTab from './EMCTab';

import emcTheme from '../lib/emcTheme';

@ThemeDecorator(emcTheme)
@radium
export default class AppContainer extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    disableAppBar: PropTypes.bool,
    disableTabPadding: PropTypes.bool,
    navigation: PropTypes.array
  };

  static defaultProps = {
    className: 'app-container',
    css: {},
    disableAppBar: false,
    disableTabPadding: false,
    navigation: []
  };

  state = {
    title: this.title
  };

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

  css = {
    root: {
      paddingBottom: this.props.disableTabPadding ? 0 : 64
    },

    appBar: {
      color: 'inherit',
      background: 'inherit',
      position: 'fixed'
    },

    content: {
      paddingTop: this.props.disableAppBar ? 0 : 64
    },

    footer: {
      // color: emcColors.offWhite.hexString(),
      // background: emcColors.darkGrey.hexString(),
      padding: 10
    }
  };

  render() {
    let css = this.props.css || {};

    let breadcrumbs = this.renderBreadcrumbs(),
        titleStyle = {fontWeight: 'normal', fontSize: '1.2em', margin: 0},
        title = <h1 style={titleStyle}>{breadcrumbs}</h1>;

    return (
      <div
          className={this.props.className + ' app-canvas'}
          style={[this.css.root, css.root]}>
        <AppCanvas>
          {this.props.disableAppBar ? null : <AppBar
              onLeftIconButtonTouchTap={this.toggleLeftNavigation.bind(this)}
              title={title}
              style={this.css.appBar}
              zDepth={0} />}

          {this.props.navigation && <AppNavigation
              ref="navigation"
              title={this.props.title}
              menuItems={this.props.navigation} />}

          <div ref="content" style={[this.css.content, css.content]}>
            {this.props.children}
          </div>

          <Snackbar
              ref="error"
              action="dismiss"
              message={this.state.error || 'Unknown error.'}
              onActionTouchTap={this.dismissError.bind(this)} />

          <footer style={[this.css.footer, css.footer]}>
            <span key={0}>© 2015 EMC<sup>2</sup></span>
          </footer>

          <EMCTab ref="emcTab" />
        </AppCanvas>
      </div>
    );
  }

  renderBreadcrumbs() {
    if (this.props.disableAppBar || !this.props.routes) return [];

    let breadcrumbs = [],
        title = this.title,
        depth = this.props.routes.length;

    this.props.routes.forEach((item, index) => {
      let path = (item.path || '').split('/');

      let showLastParam = path[path.length - 1].charAt(0) === ':',
          isNotLast = (index + 1) < depth;

      path = path.map(segment => {
        if (segment.charAt(0) === ':') {
          return this.props.params[segment.slice(1)];
        }
        return segment;
      });

      let targetPath = path.slice(0);
      targetPath.pop();
      let target = targetPath.join('/');

      title += item.name || item.component.name;
      breadcrumbs.push(
        <Link key={'l' + index} to={target}
              style={{textDecoration: 'none'}}>
          {item.name || item.component.name}
        </Link>
      );

      if (isNotLast) {
        title += ' > ';
        breadcrumbs.push(<span key={'s' + index}>&nbsp;{'>'}&nbsp;</span>);
      }

      else if (showLastParam) {
        title += ' > ' + path[path.length - 1];
        breadcrumbs.push(<span key={'s' + (index + 1)}>&nbsp;{'>'}&nbsp;</span>);
        breadcrumbs.push(
          <Link key={'l' + (index + 1)} to={path.join('/')}
              style={{textDecoration: 'none'}}>
            {path[path.length - 1]}
          </Link>
        );
      }
    });

    return breadcrumbs;
  }

  toggleLeftNavigation() {
    this.refs.navigation.toggleLeftNav();
  }

  onError(errorMsg) {
    this.showError(errorMsg);
  }

  showError(error) { this.setState({error: error.message || error || 'Unknown Error'}); }

  dismissError() {
    this.refs.error.dismiss();
    this.setState({error: null});
  }

  get title() {
    return this.findTitle().innerHTML;
  }

  set title(title) {
    this.setState({ title });
    this.findTitle().innerHTML = title;
  }

  findTitle() {
    return document.head.querySelector('title');
  }

}
