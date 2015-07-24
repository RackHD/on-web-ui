'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';
// import mixin from 'react-mixin';
import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

import {
    Tabs,
    Tab
  } from 'material-ui';

import WEInspector from './Inspector';
import WEWorkflowJSON from './WorkflowJSON';
import WETasksLibrary from './TasksLibrary';
import WETWorkflowsLibrary from './WorkflowsLibrary';

@radium
@decorate({
  propTypes: {
    className: PropTypes.string,
    css: PropTypes.object,
    editor: PropTypes.object,
    styles: PropTypes.object
  },

  defaultProps: {
    className: '',
    css: {},
    editor: null,
    styles: {}
  },

  contextTypes: {
    layout: PropTypes.any,
    editor: PropTypes.any
  }
})
export default class WETray extends Component {

  state = {};

  css = {
    root: {
      width: '32%',
      background: 'white',
      minWidth: 300,
      verticalAlign: 'top',
      borderLeft: '2px solid #eee'
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let css = {
      root: [this.css.root, this.props.css.root, this.props.style]
    };
    return (
      <div ref="root" className={this.props.className} style={css.root}>
        <Tabs ref="tabs" contentContainerStyle={{maxHeight: window.innerHeight - 86, overflow: 'auto'}}>
          <Tab label="Inspector">
            <WEInspector ref="inspector" />
          </Tab>
          <Tab label="JSON">
            <WEWorkflowJSON ref="json" />
          </Tab>
          <Tab label="Tasks">
            <WETasksLibrary ref="tasks" />
          </Tab>
          <Tab label="Workflows">
            <WETWorkflowsLibrary ref="workflows" />
          </Tab>
        </Tabs>
      </div>
    );
  }

  viewInspector() {
    this.refs.tabs.setState({selectedIndex: 0});
  }

  viewJSON() {
    this.refs.tabs.setState({selectedIndex: 1});
  }

  viewTasks() {
    this.refs.tabs.setState({selectedIndex: 2});
  }

  viewWorkflows() {
    this.refs.tabs.setState({selectedIndex: 3});
  }

}
