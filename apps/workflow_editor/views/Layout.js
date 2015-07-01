'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

import {
    Tabs,
    Tab
  } from 'material-ui';

import GraphCanvas from 'common-web-ui/views/GraphCanvas';

import GraphWorkflowHelpers from '../mixins/GraphWorkflowHelpers';

import WEToolbar from './Toolbar';
import WETasksTray from './Tray';
import WEInspector from './Inspector';

import './EditorLayout.less'; // TODO: move css into this file

@radium
@mixin.decorate(GraphWorkflowHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    styles: PropTypes.object
  },

  defaultProps: {
    className: '',
    styles: {}
  }
})
export default class WELayout extends Component {

  state = {
    canvasWidth: 1000,
    canvasHeight: 1000
  };

  componentDidMount() {
    this.updateCanvasSize();
    var resizeTimer = null;
    this.handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(this.updateCanvasSize.bind(this), 300);
    };
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
    document.body.classList.add('no-select');
    this.refs.graphCanvas.onSelect((selection) => {
      this.refs.inspector.update(selection);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    this.handleResize = null;
    document.body.classList.remove('no-select');
  }

  render() {
    var supported = window.innerWidth > 700 && window.innerHeight > 700;
    // TODO: check for mobile, mobile is not currently supported.
    if (!supported) {
      return (
        <div className="WorkflowEditor container">
          Workflow Editor requires a larger viewport.
        </div>
      );
    }
    return (
      <div className="WorkflowEditor" ref="root">
        <GraphCanvas
            ref="graphCanvas"
            initialScale={2.4}
            viewWidth={this.state.canvasWidth}
            viewHeight={this.state.canvasHeight} />
        <div className="overlay container">
          <WEToolbar ref="toolbar" editor={this} />
          <Tabs style={{width: 300, clear: 'both', float: 'right'}}>
            <Tab label="Inspector">
              <WEInspector ref="inspector" editor={this} />
            </Tab>
            <Tab label="Tasks">
              <WETasksTray ref="tray" />
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }

  updateCanvasSize() {
    var canvasElem = React.findDOMNode(this.refs.root || this),
        canvasWidth = canvasElem.offsetWidth,
        canvasHeight = Math.max(800, window.innerHeight - 300);
    if (this.state.canvasWidth !== canvasWidth) { this.setState({ canvasWidth }); }
    if (this.state.canvasHeight !== canvasHeight) { this.setState({ canvasHeight }); }
  }

}
