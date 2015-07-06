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
  }
})
export default class WETray extends Component {

  state = {};

  css = {
    root: {
      width: '40%',
      verticalAlign: 'top',
      borderLeft: '2px solid #eee'
    },
    tabs: {
      height: '100%'
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let css = {
      root: [this.css.root, this.props.css.root, this.props.style],
      tabs: [this.css.tabs, this.props.css.tabs]
    };
    return (
      <div ref="root" className={this.props.className} style={css.root}>
        <Tabs style={css.tabs}>
          <Tab label="Inspector">
            <WEInspector ref="inspector" editor={this.props.editor} />
          </Tab>
          <Tab label="Tasks">
            <WETasksLibrary ref="tasks" editor={this.props.editor} />
          </Tab>
          <Tab label="Workflows">
            <WETWorkflowsLibrary ref="workflows" editor={this.props.editor} />
          </Tab>
        </Tabs>
      </div>
    );
  }

}
