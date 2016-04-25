// Copyright 2015, EMC, Inc.

'use strict';

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

import EMCTab from 'rui-common/views/EMCTab';

import emcTheme from 'rui-common/lib/emcTheme';

import WorkflowStore from 'rui-common/stores/WorkflowStore';

@radium
export default class MonoRailToolbar extends Component {

  static contextTypes = {
    routes: PropTypes.any
  };

  static defaultProps = {
    css: {}
  };

  workflowStore = new WorkflowStore();

  componentWillMount() {
    this.workflowStore.startMessenger();
  }

  componentDidMount() {
    this.unwatchWorkflows = this.workflowStore.watchAll('workflows', this);
    this.listWorkflows();
    this.reloadInterval = setInterval(this.listWorkflows.bind(this), 12000);
  }

  componentWillUnmount() {
    this.workflowStore.stopMessenger();
    this.unwatchWorkflows();
    clearInterval(this.reloadInterval);
  }

  css = {
    root: {
      height: 'inherit',
      overflowX: 'hidden',
      overflowY: 'auto'
    }
  };

  state = {
    loading: false,
    workflows: []
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
    }

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
      let status = workflow.completeEventString ||
        (workflow.cancelled ? 'cancelled' : workflow._status);

      const statusIconMap = {
        cancelled: 'fa-ban',
        failed: 'fa-times',
        finished: 'fa-circle',
        succeeded: 'fa-check'
      };

      const statusColorMap = {
        cancelled: 'yellow',
        failed: 'red',
        finished: '#6cf',
        succeeded: 'green'
      }

      let nodeId = this.workflowStore.getNodeId(workflow);

      return (
        <Link key={workflow.instanceId} to={'/oc/' + workflow.instanceId} style={linkStyle}>
          <ListItem
              style={getLinkStyle(workflow.instanceId)}
              leftIcon={
                <FontIcon
                    className={'fa fa-fw ' + (statusIconMap[status] || 'fa-spinner fa-spin')}
                    style={{color: (statusColorMap[status] || 'white')}} />
              }
              primaryText={workflow.name}
              secondaryText={nodeId && <div style={{color: '#999'}}>{nodeId}</div>} />
        </Link>
      );
    });

    return (
      <div style={css.root}>
        {/*<LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />*/}
        <List>{list}</List>
      </div>
    );
  }

  listWorkflows() {
    this.setState({loading: true});
    this.workflowStore.list().then(() => this.setState({loading: false}));
  }

}
