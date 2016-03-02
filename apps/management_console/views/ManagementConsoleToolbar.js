// Copyright 2015, EMC, Inc.

'use strict';

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

import emcTheme from 'rui-common/lib/emcTheme';

@radium
export default class MonoRailToolbar extends Component {

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
    }

    // let activeListItemStyle = {color: emcTheme.emcColors.emcBlue},
    //     activeFontIconStyle = {color: emcTheme.emcColors.emcBlue};
    //
    let props = {}
    //   onMouseEnter: this.props.onMouseEnter,
    //   onMouseLeave: this.props.onMouseLeave
    // };
    //
    // let checkTarget = (target) => {
    //   if (!this.props.routes) return false;
    //   if (!this.props.routes[1]) return false;
    //   if (!this.props.routes[1].path) return false;
    //   return this.props.routes[1].path.substr(1) === target;
    // };
    //
    // let getLinkStyle = (target) => {
    //   if (checkTarget(target)) return activeListItemStyle;
    //   return null;
    // };
    //
    // let getIconStyle = (target) => {
    //   if (checkTarget(target)) return activeFontIconStyle;
    //   return null;
    // };

    return (
      <div style={css.root} {...props}>
        <div style={{position: 'relative'/*, height: window.innerHeight*/}}>
          <List style={{float: 'left', width: this.props.width, overflow: 'hidden', transition: 'width 1s'}}>
            <Link to="/mc/dashboard" style={linkStyle}>
              <ListItem primaryText="Dashboard" />
            </Link>

            <Divider />
            <Link to="/mc/nodes" style={linkStyle}>
              <ListItem primaryText="Nodes" />
            </Link>
            <Link to="/mc/pollers" style={linkStyle}>
              <ListItem primaryText="Pollers" />
            </Link>
            <Link to="/mc/workflows" style={linkStyle}>
              <ListItem primaryText="Workflows" />
            </Link>

            <Divider />
            <Link to="/mc/catalogs" style={linkStyle}>
              <ListItem primaryText="Catalogs" />
            </Link>
            <Link to="/mc/skus" style={linkStyle}>
              <ListItem primaryText="SKUs" />
            </Link>
            <Link to="/mc/obms" style={linkStyle}>
              <ListItem primaryText="OBM Services" />
            </Link>

            <Divider />
            <Link to="/mc/files" style={linkStyle}>
              <ListItem primaryText="Files" />
            </Link>
            <Link to="/mc/profiles" style={linkStyle}>
              <ListItem primaryText="Profiles" />
            </Link>
            <Link to="/mc/templates" style={linkStyle}>
              <ListItem primaryText="Templates" />
            </Link>

            <Divider />
            <Link to="/mc/config" style={linkStyle}>
              <ListItem primaryText="Config" />
            </Link>
            <Link to="/mc/versions" style={linkStyle}>
              <ListItem primaryText="Versions" />
            </Link>
          </List>
        </div>
      </div>
    );
  }

}
