'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

import cloneDeep from 'lodash/lang/cloneDeep';

import {} from 'material-ui';

import GraphCanvas, {
    GCGroup,
    GCLink,
    GCNode,
    GCPort,
    GCSocket
  } from 'graph-canvas-web-ui/views/GraphCanvas';

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
export default class WorkflowEditor extends Component {

  editor = new Editor(this);

  state = {
    version: 0,
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
            {this.newGraphCanvas()}
          </div>
          <WETray ref="tray" className="cell" />
        </div>
        <div ref="overlay" className="overlay" style={css.overlay}></div>
      </div>
    );
  }

  newGraphCanvas() {
    this.groups = {};
    return <GraphCanvas
        key={'graphCanvas' + this.state.version}
        ref="graphCanvas"
        initialScale={1}
        viewWidth={this.state.canvasWidth}
        viewHeight={this.state.canvasHeight}
        worldWidth={3000}
        worldHeight={3000} />;
  }

  resetWorkflow() {
    this.setState(prevState => {version: prevState.version + 1});
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
        if (workflowTemplate) { this.loadWorkflow(workflowTemplate, true); }
      });
    }
  }

  loadWorkflow(workflowTemplate, newGraph) {
    if (newGraph) { this.resetWorkflow(); }
    setTimeout(() => {
      let workflowGraph = cloneDeep(workflowTemplate);
      // this.workflowGraph = workflowGraph;
      this.refs.tray.refs.inspector.refs.outline.setState({model: workflowGraph})
      this.loadWorkflowTemplate(workflowGraph);
    }, 32);
  }

  loadWorkflowTemplate(workflowGraph) {
    let workflowGroupId = GCGroup.id();

    this.groups[workflowGroupId] = workflowGraph;

    workflowGraph._ = {};
    workflowGraph._.groupId = workflowGroupId;

    var ids = {}, testId = (id) => {
      if (ids[id]) { throw new Error('ID ALREADY EXISTS ' + id); }
      ids[id] = true;
    }
    testId(workflowGroupId);

    // Setup Workflow
    React.withContext({
      graphCanvas: this.refs.graphCanvas
    }, () => {
      let taskCount = workflowGraph.tasks.length;
      let taskGutter = 30;
      let taskSizeX = 320;
      let taskSizeY = 220;
      let taskWidth = taskGutter + taskSizeX;
      let taskHeight = taskGutter + taskSizeY;
      let minSizeX = taskGutter + taskWidth / 2;
      let minSizeY = taskGutter + 10 + taskHeight / 2;
      let columns = 4;
      let sizeX = Math.max(minSizeX, taskGutter + (columns * taskWidth) / 2);
      let sizeY = Math.max(minSizeY, taskGutter + (Math.ceil(taskCount / columns) * taskHeight) / 2);

      let workflowGroup = (
        <GCGroup key={workflowGroupId}
            initialBounds={[
              1500 - sizeX, 1500 - sizeY,
              1500 + sizeX, 1500 + sizeY
            ]}
            initialColor="#777"
            initialName={workflowGraph.friendlyName}
            initialId={workflowGroupId} />
      );

      workflowGraph._.groupElement = workflowGroup;

      // TODO: add handler to remove from this.groups
      this.refs.graphCanvas.refs.world.appendChild(workflowGroup);

      setTimeout(() => {
        let workflowGroupComponent = this.refs.graphCanvas.lookup(workflowGroupId);
        workflowGraph._.groupComponent = workflowGroupComponent;

        // Setup Workflow Nodes
        let taskMap = workflowGraph._.taskMap = {};

        workflowGraph.tasks.forEach((task, taskNumber) => {
          taskMap[task.label] = task;

          let taskNodeId = GCNode.id(),
              orderPortId = GCPort.id(),
              waitOnId = GCSocket.id(),
              failedId = GCSocket.id(),
              succeededId = GCSocket.id(),
              finishedId = GCSocket.id();

          testId(taskNodeId);
          testId(orderPortId);
          testId(waitOnId);
          testId(failedId);
          testId(succeededId);
          testId(finishedId);

          task._ = {};
          task._.nodeId = taskNodeId;
          task._.orderSocketIds = {
            waitOn: waitOnId,
            failed: failedId,
            succeeded: succeededId,
            finished: finishedId
          };

          React.withContext({
            graphCanvas: this.refs.graphCanvas,
            parentGCGroup: workflowGroupComponent
          }, () => {
            let row = Math.floor(taskNumber / columns),
                col = taskNumber % columns;

            let taskNode = (
              <GCNode key={taskNodeId}
                  initialBounds={[
                    taskGutter + (col * taskWidth), taskGutter + (row * taskHeight),
                    taskWidth + (col * taskWidth), taskHeight + (row * taskHeight)
                  ]}
                  initialColor="#ccc"
                  initialId={taskNodeId}
                  initialName={task.label}>
                <GCPort key={orderPortId}
                    initialColor="#469"
                    initialId={orderPortId}
                    initialName="Run Order">
                  <GCSocket key={waitOnId}
                      dir={[-1, 0]}
                      initialColor="#249"
                      initialId={waitOnId}
                      initialName="Wait" />
                  <GCSocket key={failedId}
                      dir={[1, 0]}
                      initialColor="#227"
                      initialId={failedId}
                      initialName="Failed" />
                  <GCSocket key={succeededId}
                      dir={[1, 0]}
                      initialColor="#227"
                      initialId={succeededId}
                      initialName="Succeeded" />
                  <GCSocket key={finishedId + 'a'}
                      dir={[1, 0]}
                      initialColor="#227"
                      initialId={finishedId + 'a'}
                      initialName="Finished" />
                </GCPort>
              </GCNode>
            );

            task._.nodeElement = taskNode;

            // TODO: add handler to remove this task from workflowGraph.tasks
            workflowGroupComponent.appendChild(taskNode);
          });
        });

        // Setup Workflow Links
        let links = workflowGraph._.links = {};
        workflowGraph.tasks.forEach(task => {
          if (task.waitOn) {
            Object.keys(task.waitOn).forEach(taskLabel => {
              var state = task.waitOn[taskLabel],
                  linkedTask = taskMap[taskLabel],
                  socketFrom = task._.orderSocketIds.waitOn,
                  socketTo = linkedTask._.orderSocketIds[state];

              React.withContext({
                graphCanvas: this.refs.graphCanvas,
                parentGCGroup: workflowGroupComponent
              }, () => {
                let orderLinkId = GCLink.id();

                let link = (
                  <GCLink key={orderLinkId}
                      from={socketFrom}
                      to={socketTo}
                      initialColor="#6cf" />
                );

                links[orderLinkId] = link;

                // TODO: add handler to remove this task from workflowGraph.tasks
                workflowGroupComponent.appendChild(link);
              });
            });
          }
        });
      }, 32);
    });
  }

}
