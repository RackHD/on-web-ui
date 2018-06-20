// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import radium from 'radium';
import moment from 'moment';

import { RouteHandler, Link } from 'react-router';

import {
    FontIcon,
    IconButton,
    LinearProgress,
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

  componentWillReceiveProps(nextProps) {
    let nextState = {};
    if (nextProps.workflows) { nextState.workflows = nextProps.workflows; }
    this.setState(nextState);
  }

  css = {
    root: {
      height: 'inherit',
      overflowX: 'hidden',
      overflowY: 'auto'
    }
  };

  state = {
    loading: this.props.loading,
    workflows: this.props.workflows
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

    let routes = this.context.routes;

    let checkTarget = (target) => {
      if (!routes) return false;
      if (!routes[2]) return false;
      if (!routes[2].path) return false;
      return routes[2].path.substr(1).indexOf(target) !== -1;
    };

    let getLinkStyle = (target) => {
      if (checkTarget(target)) return activeListItemStyle;
      return null;
    };

    // let getIconStyle = (target) => {
    //   if (checkTarget(target)) return activeFontIconStyle;
    //   return null;
    // };

    let list = this.state.workflows;

    list = list.sort(
      (a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix()
    );

    list = list.map(workflow => {
      // let status = workflow.completeEventString ||
      //   (workflow.cancelled ? 'cancelled' : workflow._status);
      let status = (workflow.status || 'unknown').toLowerCase();

      const statusIconMap = {
        unknown: 'fa-ban',
        cancelled: 'fa-ban',
        failed: 'fa-times',
        finished: 'fa-circle',
        succeeded: 'fa-check'
      };

      const statusColorMap = {
        unknown: 'yellow',
        cancelled: 'yellow',
        failed: 'red',
        finished: '#6cf',
        succeeded: 'green'
      };

      return (
        <Link className={'Workflow-' + workflow.instanceId}
              key={workflow.instanceId}
              style={linkStyle}
              to={'/oc/' + workflow.instanceId}>
          <ListItem
              style={getLinkStyle(workflow.instanceId)}
              leftIcon={
                <FontIcon
                    className={'fa fa-fw ' + (statusIconMap[status] || 'fa-spinner fa-spin')}
                    style={{color: (statusColorMap[status] || 'white')}} />
              }
              primaryText={workflow.name + ' - ' + status.charAt(0).toUpperCase() + status.substr(1)}
              secondaryText={workflow.nodeId && <div style={{color: '#999'}}>{workflow.nodeId}</div>} />
        </Link>
      );
    });

    return (
      <div className="ActiveOperationsList" style={css.root}>
        {/*<LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />*/}
        <List>{list}</List>
      </div>
    );
  }

}
