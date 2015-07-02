'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

import {
    Dialog,
    Tabs,
    Tab
  } from 'material-ui';

import GraphCanvas from 'common-web-ui/views/GraphCanvas';

import GraphWorkflowHelpers from '../mixins/GraphWorkflowHelpers';

import WEToolbar from './Toolbar';
import WETasksLibrary from './TasksLibrary';
import WETWorkflowsLibrary from './WorkflowsLibrary';
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
    // var supported = window.innerWidth > 800 && window.innerHeight > 600;
    // TODO: check for mobile, mobile is not currently supported.
    // if (!supported) {
    //   return (
    //     <div className="WorkflowEditor">
    //       <p>Workflow Editor requires a larger viewport.</p>
    //     </div>
    //   );
    // }
    let standardActions = [
      { text: 'Cancel' },
      { text: 'Submit', onTouchTap: this._onDialogSubmit, ref: 'submit' }
    ];
    return (
      <div ref="root" className="WorkflowEditor ungrid">
        <div className="line">
          <div ref="canvasCell" className="cell">
            <WEToolbar ref="toolbar" editor={this} />
            <GraphCanvas
              ref="graphCanvas"
              initialScale={2.4}
              viewWidth={this.state.canvasWidth}
              viewHeight={this.state.canvasHeight} />
          </div>
          <div className="cell" style={{width: '40%', verticalAlign: 'top', borderLeft: '2px solid #eee'}}>
            <Tabs style={{height: '100%'}}>
              <Tab label="Inspector">
                <WEInspector ref="inspector" editor={this} />
              </Tab>
              <Tab label="Tasks">
                <WETasksLibrary ref="tasks" editor={this} />
              </Tab>
              <Tab label="Workflows">
                <WETWorkflowsLibrary ref="workflows" editor={this} />
              </Tab>
            </Tabs>
          </div>
        </div>
        <div className="overlay container">
          <Dialog
            ref="dialog"
            title="Dialog With Standard Actions"
            actions={standardActions}
            actionFocus="submit"
            modal={this.state.modal}>
            {'The actions in this window are created from the json that\'s passed in.'}
          </Dialog>
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
