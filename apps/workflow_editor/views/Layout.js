'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

import {
  } from 'material-ui';

import GraphCanvas from 'graph-canvas-web-ui/views/GraphCanvas';

import WEToolbar from './Toolbar';
import WETray from './Tray';

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
  },

  childContextTypes: {
    layout: PropTypes.any,
    editor: PropTypes.any
  }
})
export default class WELayout extends Component {

  editor = new Editor(this);

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

  getChildContext() {
    return {
      layout: this,
      editor: this.editor
    };
  }

  componentWillMount() {
    this.editor.onGraphUpdate(graph => {
      this.refs.graphCanvas.updateGraph(graph);
    });
    this.loadWorkflowFromParams();
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

  // componentWillReceiveProps(nextProps) {
    // TODO: fix this
    // this.loadWorkflowFromParams(nextProps);
  // }

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
            <WEToolbar ref="toolbar" />
            <GraphCanvas
              ref="graphCanvas"
              initialGraph={this.editor.graph}
              initialScale={1}
              viewWidth={this.state.canvasWidth}
              viewHeight={this.state.canvasHeight}
              worldWidth={3000}
              worldHeight={3000} />
          </div>
          <WETray ref="tray" className="cell" />
        </div>
        <div ref="overlay" className="overlay" style={css.overlay}></div>
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

  loadWorkflowFromParams(props) {
    props = props || this.props;
    if (props.params && props.params.workflow) {
      let workflowName = decodeURIComponent(props.params.workflow);
      this.editor.workflowTemplateStore.list().then(() => {
        let workflowTemplate = this.editor.getWorkflowTemplateByName(workflowName);
        if (workflowTemplate) {
          this.editor.loadWorkflow(workflowTemplate, true);
        }
      });
    }
  }

}
