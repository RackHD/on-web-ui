// Copyright 2015, EMC, Inc.

'use strict';

import merge from 'lodash/object/merge';
import React, { Component, PropTypes } from 'react';
import radium from 'radium';
import { RouteHandler, Link } from 'react-router';

import { AppBar, AppCanvas, FontIcon } from 'material-ui';
import ThemeDecorator from 'material-ui/lib/styles/theme-decorator';

import AppNavigation from './AppNavigation';
import EMCTab from './EMCTab';
import ErrorNotification from './ErrorNotification';

import FormatHelpers from '../mixins/FormatHelpers';

import emcTheme from '../lib/emcTheme';

@ThemeDecorator(emcTheme)
@radium
export default class AppContainer extends Component {

  static propTypes = {
    afterBreadcrumbs: PropTypes.any,
    afterContent: PropTypes.any,
    beforeBreadcrumbs: PropTypes.any,
    beforeContent: PropTypes.any,
    className: PropTypes.string,
    css: PropTypes.object,
    disableAppBar: PropTypes.bool,
    disableTabPadding: PropTypes.bool,
    navigation: PropTypes.array,
    replaceBreadcrumbs: PropTypes.any,
    rightAppBarIconElement: PropTypes.any,
    title: PropTypes.string
  };

  static defaultProps = {
    afterBreadcrumbs: null,
    afterContent: null,
    beforeBreadcrumbs: null,
    beforeContent: null,
    className: 'app-container',
    css: {},
    disableAppBar: false,
    disableTabPadding: false,
    navigation: [],
    replaceBreadcrumbs: null,
    rightAppBarIconElement: null,
    title: '',
  };

  static childContextTypes = {
    appContainer: PropTypes.any,
    muiTheme: PropTypes.any
  };

  state = {};

  getChildContext() {
    return {
      appContainer: this,
      muiTheme: emcTheme
    };
  }

  componentWillMount() {
    this.handleError = this.onError.bind(this)
    window.onerror = this.handleError;
  }

  componentDidMount() {
    this.handleResize = () => {
      this.refs.content.style.height = (window.innerHeight - (this.gutter * 2) + 'px')
    };
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
  }


  componentWillUnmount() {
    window.onerror = null;
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    this.handleResize = null;
  }

  componentDidUpdate() {
    if (this.state.error) { this.refs.error.show(); }
  }

  gutter = 64;

  css = {
    root: {
      paddingBottom: this.props.disableTabPadding ? 0 : this.gutter
    },

    appBar: {
      color: 'inherit',
      background: 'inherit',
      position: 'fixed'
    },

    content: {
      paddingTop: this.props.disableAppBar ? 0 : this.gutter
    },

    footer: {
      padding: 10
    }
  };

  render() {
    let css = {
      root: [
        this.css.root,
        this.state.fullscreenMode ? {paddingBottom: 0} : null,
        this.props.css.root,
        this.props.style
      ],

      // AppBar does not support Radium style
      appBar: merge({},
        this.css.appBar,
        this.state.fullscreenMode ? {position: 'relative', height: 64} : null,
        this.props.css.appBar
      ),

      content: [
        this.css.content,
        this.state.fullscreenMode ? {paddingTop: 0, height: window.innerHeight - (this.gutter * 2)} : null,
        this.props.css.content
      ],

      footer: [
        this.css.footer,
        this.props.css.footer
      ]
    };

    let breadcrumbs = this.props.replaceBreadcrumbs || this.renderBreadcrumbs(),
        titleStyle = {fontWeight: 'normal', fontSize: '1em', margin: 0, height: 64},
        title = this.props.title || this.props.replaceBreadcrumbs ?
          <div style={titleStyle}>
            {this.props.beforeBreadcrumbs}
            {breadcrumbs}
            {this.props.afterBreadcrumbs}
          </div> :
          <h1 style={titleStyle}>
            {this.props.beforeBreadcrumbs}
            {breadcrumbs}
            {this.props.afterBreadcrumbs}
          </h1>;

    return (
      <div
          className={this.props.className + ' app-canvas'}
          style={css.root}>
        <AppCanvas>
          <header>
            {this.props.disableAppBar ? null : <AppBar
                onLeftIconButtonTouchTap={this.toggleLeftNavigation.bind(this)}
                iconElementRight={this.props.rightAppBarIconElement}
                title={title}
                titleStyle={{overflow: 'visible'}}
                style={css.appBar}
                zDepth={0} />}

            {this.props.navigation && <AppNavigation
                ref="navigation"
                title={this.props.title}
                menuItems={this.props.navigation} />}
          </header>

          {this.props.beforeContent}

          <div ref="content" style={css.content}>
            {this.props.children}
          </div>

          {this.props.afterContent}

          <ErrorNotification ref="error" />

          <footer style={css.footer}>
            {this.state.fullscreenMode ? null : <span key={0}>© 2015 EMC<sup>2</sup></span>}
          </footer>

          <EMCTab ref="emcTab" />
        </AppCanvas>
      </div>
    );
  }

  renderBreadcrumbs() {
    if (this.props.disableAppBar || !this.props.routes) return [];

    let breadcrumbs = [],
        title = 'MonoRail » ',
        depth = this.props.routes.length;

    this.props.routes.forEach((item, index) => {
      if (index === 0) return;

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
      add(targetPath.join('/'), item.name || item.component.name, index);

      if (isNotLast || showLastParam) { divide(index + 1); }
      if (showLastParam) {
        add(path.join('/'), last(path[path.length - 1]), index + 2);
      }
    });

    function add(target, name, index) {
      title += name;
      breadcrumbs.push(
        <Link key={'l' + index} to={target} style={{textDecoration: 'none'}}>
          {name}
        </Link>
      );
    }

    function divide(index) {
      title += ' » ';
      breadcrumbs.push(<span key={'s' + index}>&nbsp;{'»'}&nbsp;</span>);
    }

    function last(name) {
      if ((name.length === 24 || name.length === 36) && !((/\s/).test(name))) {
        name = FormatHelpers.shortId(name);
      }
      return name;
    }

    this.title = title;

    return <div style={{float: 'left'}}>{breadcrumbs}</div>;
  }

  toggleLeftNavigation() {
    this.refs.navigation.toggleLeftNav();
  }

  onError(errorMsg, tries=0) {
    if (!this.refs.error) {
      if (tries > 10) { throw new Error(errorMsg); }
      return setTimeout(this.onError.bind(this, errorMsg, tries + 1), 100);
    }
    this.refs.error.showError(errorMsg);
  }

  get title() {
    return this.findTitle().innerHTML;
  }

  set title(title) {
    this.findTitle().innerHTML = title;
  }

  findTitle() {
    return document.head.querySelector('title');
  }

  fullscreenMode(enable) {
    this.setState({fullscreenMode: enable}, () => {
      if (this.state.fullscreenMode) {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('no-select');
      }
      else {
        document.body.style.overflow = 'visible';
        document.body.classList.remove('no-select');
      }
    });
  }

}
