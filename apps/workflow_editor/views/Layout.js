'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';
// import mixin from 'react-mixin';
import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

import {
  } from 'material-ui';

import GraphCanvas from 'graph-canvas-web-ui/views/GraphCanvas';

import WEToolbar from './Toolbar';
import WETray from './Tray';

import WELoadWorkflowDialog from './dialogs/LoadWorkflow';

import Editor from '../lib/Editor';

@radium
@decorate({
  propTypes: {
    className: PropTypes.string,
    css: PropTypes.object,
    styles: PropTypes.object
  },

  defaultProps: {
    className: '',
    css: {},
    styles: {}
  }
})
export default class WELayout extends Component {

  state = {
    canvasWidth: 1000,
    canvasHeight: 1000
  };

  css = {
    root: {
      minWidth: 1000,
      position: 'relative'
    },

    overlay: {
      position: 'absolute',
      // box-sizing: 'border-box',
      height: 0,
      width: '100%',
      top: 0
    }
  }

  componentWillMount() {
    this.editor = new Editor(this);
    this.editor.onGraphUpdate(graph => {
      this.refs.graphCanvas.refs.world.updateGraph(graph);
    });
    if (this.props.params && this.props.params.workflow) {
      let workflowName = decodeURIComponent(this.props.params.workflow);
      this.editor.workflowStore.list().then(() => {
        let workflow = this.editor.workflowStore.collection[workflowName];
        if (workflow) {
          this.editor.loadWorkflow(workflow, true);
        }
      });
    }
  }

  componentDidMount() {
    this.updateCanvasSize();
    setTimeout(this.updateCanvasSize.bind(this), 1000);
    var resizeTimer = null;
    this.handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(this.updateCanvasSize.bind(this), 300);
    };
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
    document.body.classList.add('no-select');
    this.refs.graphCanvas.onSelect((selection) => {
      this.refs.tray.refs.inspector.update(selection);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    this.handleResize = null;
    document.body.classList.remove('no-select');
  }

  render() {
    // var supported = true;
    // // TODO: check for mobile, mobile is not currently supported.
    // if (!supported) {
    //   return (
    //     <div className="WorkflowEditor">
    //       <p>Workflow Editor requires a larger viewport.</p>
    //     </div>
    //   );
    // }
    let css = {
      root: [this.css.root, this.props.css.root, this.props.style],
      overlay: [this.css.overlay, this.props.css.overlay]
    };
    return (
      <div ref="root" className="WorkflowEditor ungrid" style={css.root}>
        <div className="line">
          <div ref="canvasCell" className="cell">
            <WEToolbar ref="toolbar" editor={this.editor} />
            <GraphCanvas
              ref="graphCanvas"
              initialGraph={this.editor.graph}
              initialScale={1}
              viewWidth={this.state.canvasWidth}
              viewHeight={this.state.canvasHeight}
              worldWidth={3000}
              worldHeight={3000} />
          </div>
          <WETray ref="tray" className="cell" editor={this.editor} />
        </div>
        <div className="overlay" style={css.overlay}>
          <WELoadWorkflowDialog ref="loadWorkflowDialog" editor={this.editor} />
        </div>
      </div>
    );
  }

  updateCanvasSize() {
    var canvasCell = React.findDOMNode(this.refs.canvasCell),
        toolbarLine = React.findDOMNode(this.refs.toolbar),
        footerSize = 38,
        canvasWidth = canvasCell.offsetWidth,
        canvasHeight = window.innerHeight - toolbarLine.offsetHeight - footerSize;
    if (this.state.canvasWidth !== canvasWidth) { this.setState({ canvasWidth }); }
    if (this.state.canvasHeight !== canvasHeight) { this.setState({ canvasHeight }); }
  }

}
