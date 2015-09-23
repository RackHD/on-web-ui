// Copyright 2015, EMC, Inc.

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
    styles: PropTypes.object,
    initialWidth: PropTypes.number,
    onResize: PropTypes.func
  },

  defaultProps: {
    className: '',
    css: {},
    editor: null,
    styles: {},
    initialWidth: 400,
    onResize: null
  },

  contextTypes: {
    layout: PropTypes.any,
    editor: PropTypes.any
  }
})
export default class WETray extends Component {

  state = {
    size: this.props.initialWidth,
    hide: false
  };

  css = {
    resize: {
      cursor: 'col-resize',
      position: 'absolute',
      fontSize: 18,
      top: 18,
      left: -30
    },
    root: {
      position: 'relative',
      background: 'white',
      verticalAlign: 'top',
      borderLeft: '2px solid #eee'
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let css = {
      root: [
        this.css.root,
        {width: this.state.hide ? 0 : this.state.size},
        this.props.css.root,
        this.props.style
      ],
      resize: [
        this.css.resize,
        this.props.css.resize
      ]
    };
    return (
      <div ref="root" className={this.props.className} style={css.root}>
        <a ref="resize"
            style={css.resize}
            onDoubleClick={this.toggleTray.bind(this)}
            onMouseDown={this.resizeTray.bind(this)}
            className="fa fa-arrows-h"
            title="Resize Tray" />
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

  toggleTray() {
    let hide = !this.state.hide;
    this.setState({hide: hide});
    if (this.props.onResize) { this.props.onResize(hide ? 0 : this.state.size); }
  }

  resizeTray(event) {
    let active = true,
        pageX = event.pageX,
        size = this.state.size;

    let moveHandler = (e) => {
      if (!active) { return; }
      let diffX = e.pageX - pageX;
      this.setState({size: size - diffX});
      if (this.props.onResize) { this.props.onResize(size - diffX); }
    };

    let upHandler = () => {
      active = false;
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
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
