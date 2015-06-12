'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

// import { Paper } from 'material-ui';
import GraphCanvas from '../GraphCanvas';
import WorkflowBuilderToolbar from './WorkflowBuilderToolbar';
import WorkflowTasksTray from './WorkflowTasksTray';
import WorkflowInspector from './WorkflowInspector';
import './WorkflowBuilder.less';

export default class WorkflowBuilder extends Component {

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
    // var supported = window.innerWidth > 700 && window.innerHeight > 700;
    // // TODO: check for mobile, mobile is not currently supported.
    // if (!supported) {
    //   return (
    //     <div className="WorkflowBuilder container">
    //       Workflow builder requires a larger viewport.
    //     </div>
    //   );
    // }
    return (
      <div className="WorkflowBuilder" ref="root">
        <GraphCanvas
            ref="graphCanvas"
            initialScale={2.4}
            viewWidth={this.state.canvasWidth}
            viewHeight={this.state.canvasHeight} />
        <div className="overlay container">
          <WorkflowBuilderToolbar />
          <div className="row">
            <div className="panel left two columns">
              <WorkflowTasksTray />
            </div>
            <div className="panel right two columns">
              <WorkflowInspector ref="inspector" editor={this} />
            </div>
          </div>
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
