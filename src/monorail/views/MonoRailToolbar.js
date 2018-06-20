// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import { RouteHandler, Link } from 'react-router';

import {
    // AppBar,
    AppCanvas,
    Avatar,
    FontIcon,
    IconButton,
    List,
    ListItem,
    TextField,
    Toolbar,
    ToolbarGroup,
    ToolbarTitle
  } from 'material-ui';

import EMCTab from 'src-common/views/EMCTab';

import emcTheme from 'src-common/lib/emcTheme';

@radium
export default class MonoRailToolbar extends Component {

  static contextTypes = {
    routes: PropTypes.any
  };

  static defaultProps = {
    css: {}
  };

  css = {
    root: {
      height: 'inherit',
      overflowX: 'hidden',
      overflowY: 'auto'
      // position: 'absolute',
      // background: 'rgba(0, 0, 0, 0.5)'
    }
  };

  state = {
    isActive: this.props.active || false
  };

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

    let activeListItemStyle = {color: emcTheme.emcColors.emcBlue},
        activeFontIconStyle = {color: emcTheme.emcColors.emcBlue};

    let props = {
      onMouseEnter: this.props.onMouseEnter,
      onMouseLeave: this.props.onMouseLeave
    };

    let routes = this.context.routes;

    let checkTarget = (target) => {
      if (!routes) return false;
      if (!routes[1]) return false;
      if (!routes[1].path) return false;
      return routes[1].path.substr(1).indexOf(target) === 0;
    };

    let getLinkStyle = (target) => {
      if (checkTarget(target)) return activeListItemStyle;
      return null;
    };

    let getIconStyle = (target) => {
      if (checkTarget(target)) return activeFontIconStyle;
      return null;
    };

    return (
      <div style={css.root} {...props}>
        <div style={{position: 'relative', height: 'inherit'}}>
          <List style={{float: 'left', width: this.props.width, height: 'inherit', overflow: 'hidden', transition: 'width 1s', boxSizing: 'border-box'}}>
            <ListItem
                innerDivStyle={{paddingBottom: 0, paddingTop: 0}}
                leftIcon={
                  <FontIcon className="fa fa-bars" style={this.state.isActive ? activeFontIconStyle : null} />
                }
                onTouchTap={this.toggleMenu.bind(this)}
                primaryText={
                  <TextField hintText="Search" style={{width: 200, visibility: 'hidden'}} onTouchTap={event => event.stopPropagation()} />
                } />

            <Link to="/mc/dashboard" style={linkStyle}>
              <ListItem
                  style={getLinkStyle('mc')}
                  leftIcon={<FontIcon className="fa fa-fw fa-dashboard" style={getIconStyle('mc')}/>}
                  primaryText="Management Console" />
            </Link>

            {/*<Link to="/nt" style={linkStyle}>
              <ListItem
                  style={getLinkStyle('nt')}
                  leftIcon={<FontIcon className="fa fa-fw fa-sitemap fa-rotate-270" style={getIconStyle('nt')}/>}
                  primaryText="Network Topology" />
            </Link>*/}

            <Link to="/oc" style={linkStyle}>
              <ListItem
                  style={getLinkStyle('oc')}
                  leftIcon={<FontIcon className="fa fa-fw fa-tasks" style={getIconStyle('oc')}/>}
                  primaryText="Operations Center" />
            </Link>

            <Link to="/sp" style={linkStyle}>
              <ListItem
                  style={getLinkStyle('sp')}
                  leftIcon={<FontIcon className="fa fa-cubes fa-rotate-90" style={getIconStyle('sp')}/>}
                  primaryText="SKU Packs" />
            </Link>

            {/*<Link to="/va" style={linkStyle}>
              <ListItem
                  style={getLinkStyle('va')}
                  leftIcon={<FontIcon className="fa fa-fw fa-pie-chart" style={getIconStyle('va')}/>}
                  primaryText="Visual Analytics" />
            </Link>*/}

            <Link to="/we" style={linkStyle}>
              <ListItem
                  style={getLinkStyle('we')}
                  leftIcon={<FontIcon className="fa fa-fw fa-code-fork fa-rotate-90" style={getIconStyle('we')}/>}
                  primaryText="Workflow Editor" />
            </Link>

            <Link to="/settings" style={linkStyle}>
              <ListItem
                  style={getLinkStyle('settings')}
                  leftIcon={<FontIcon className="fa fa-fw fa-cogs" style={getIconStyle('settings')}></FontIcon>}
                  primaryText="Settings" />
            </Link>
          </List>
        </div>
        <EMCTab ref="emcTab"
            opacity={this.props.width <= (this.props.collapsedToolbarWidth + 1) ? 0 : 1}/>
      </div>
    );
  }

  toggleMenu(event) {
    if (this.props.onMenuToggle) this.props.onMenuToggle(event);
    this.setState({isActive: !this.state.isActive});
  }

}
