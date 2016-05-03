// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import { RouteHandler, Link } from 'react-router';

import {
    // AppBar,
    AppCanvas,
    Avatar,
    Divider,
    FontIcon,
    IconButton,
    List,
    ListItem,
    TextField,
    Toolbar,
    ToolbarGroup,
    ToolbarTitle
  } from 'material-ui';

import emcTheme from 'src-common/lib/emcTheme';

@radium
export default class MonoRailToolbar extends Component {

  static contextTypes = {
    routes: PropTypes.any
  };

  static defaultProps = {
    css: {},
    width: 200
  };

  css = {
    root: {
      position: 'absolute'
    }
  };

  state = {};

  render() {
    let css = {
      root: [
        this.css.root,
        this.props.css.root,
        this.props.style
      ]
    };

    let linkStyle = {
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      transition: 'color 0.5s'
    };

    let activeListItemStyle = {color: emcTheme.emcColors.emcBlue};//,
        // activeFontIconStyle = {color: emcTheme.emcColors.emcBlue};

    let routes = this.context.routes;

    let checkTarget = (target) => {
      if (!routes) return false;
      if (!routes[2]) return false;
      if (!routes[2].path) return false;
      return routes[2].path.substr(1).split('/')[1] === target;
    };

    let getLinkStyle = (target) => {
      if (checkTarget(target)) return activeListItemStyle;
      return null;
    };

    // let getIconStyle = (target) => {
    //   if (checkTarget(target)) return activeFontIconStyle;
    //   return null;
    // };

    return (
      <div style={css.root}>
        <div style={{position: 'relative'}}>
          <List style={{float: 'left', width: '100%', overflow: 'hidden', transition: 'width 1s'}}>
            <Link to="/mc/dashboard" style={linkStyle}>
              <ListItem primaryText="Dashboard" style={getLinkStyle('dashboard')} />
            </Link>

            <Divider />
            <Link to="/mc/nodes" style={linkStyle}>
              <ListItem primaryText="Nodes" style={getLinkStyle('nodes')} />
            </Link>
            <Link to="/mc/pollers" style={linkStyle}>
              <ListItem primaryText="Pollers" style={getLinkStyle('pollers')} />
            </Link>
            <Link to="/mc/workflows" style={linkStyle}>
              <ListItem primaryText="Workflows" style={getLinkStyle('workflows')} />
            </Link>

            <Divider />
            <Link to="/mc/catalogs" style={linkStyle}>
              <ListItem primaryText="Catalogs" style={getLinkStyle('catalogs')} />
            </Link>
            <Link to="/mc/skus" style={linkStyle}>
              <ListItem primaryText="SKUs" style={getLinkStyle('skus')} />
            </Link>
            <Link to="/mc/obms" style={linkStyle}>
              <ListItem primaryText="OBM Services" style={getLinkStyle('obms')} />
            </Link>

            <Divider />
            <Link to="/mc/files" style={linkStyle}>
              <ListItem primaryText="Files" style={getLinkStyle('files')} />
            </Link>
            <Link to="/mc/profiles" style={linkStyle}>
              <ListItem primaryText="Profiles" style={getLinkStyle('profiles')} />
            </Link>
            <Link to="/mc/templates" style={linkStyle}>
              <ListItem primaryText="Templates" style={getLinkStyle('templates')} />
            </Link>

            <Divider />
            <Link to="/mc/config" style={linkStyle}>
              <ListItem primaryText="Config" style={getLinkStyle('config')} />
            </Link>
          </List>
        </div>
      </div>
    );
  }

}
