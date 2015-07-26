'use strict';

import { EventEmitter } from 'events';

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

import Rectangle from 'graph-canvas-web-ui/lib/Rectangle';

import WEToolbar from './Toolbar';
import WETray from './Tray';

import TaskDefinition from '../lib/TaskDefinition';
import WorkflowTemplate from '../lib/WorkflowTemplate';

import TaskDefinitionStore from '../stores/TaskDefinitionStore';
import WorkflowTemplateStore from '../stores/WorkflowTemplateStore';

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

  taskDefinitionStore = new TaskDefinitionStore(TaskDefinition);
  workflowTemplateStore = new WorkflowTemplateStore(WorkflowTemplate);

  getTaskDefinitionByName(name) {
    return this.taskDefinitionStore.collection[name];
  }

  getWorkflowTemplateByName(name) {
    return this.workflowTemplateStore.collection[name];
  }

  getTaskDefinitionFromTask(task) {
    return task.taskDefinition ||
      this.getTaskDefinitionByName(task.taskName) ||
      {};
  }

  onGraphUpdate(handler) {
    this.emitter.on('graphUpdate', handler);
  }

  emitGraphUpdate() {
    this.emitter.emit('graphUpdate');
  }

  editor = this;
  emitter = new EventEmitter();

  state = {
    trayWidth: window.innerWidth * 0.4,
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
      editor: this
    };
  }

  componentWillMount() {
    // this.editor.onGraphUpdate(graph => {
    //   this.refs.graphCanvas.updateGraph(graph);
    // });
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

  // componentDidUpdate() {
  //   debugger;
  //   this.refs.graphCanvas.onSelect((selection) => {
  //     debugger;
  //     this.refs.tray.refs.inspector.update(selection);
  //   });
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
          <WETray ref="tray" className="cell"
              initialWidth={this.state.trayWidth}
              onResize={this.updateTraySize.bind(this)} />
        </div>
        <div ref="overlay" className="overlay" style={css.overlay}></div>
      </div>
    );
  }

  newGraphCanvas() {
    this.workflowGraphs = {};
    return <GraphCanvas
        key={'graphCanvas' + this.state.version}
        ref="graphCanvas"
        initialScale={1}
        viewWidth={this.state.canvasWidth}
        viewHeight={this.state.canvasHeight}
        worldWidth={3000}
        worldHeight={3000}
        onSelect={this.onSelect.bind(this)} />;
  }

  onSelect(selection) {
    this.refs.tray.refs.inspector.update(selection);
  }

  resetWorkflow() {
    this.setState(prevState => ({version: prevState.version + 1}));
    this.refs.tray.refs.inspector.refs.outline.setState({model: {}});
  }

  updateTraySize(trayWidth) {
    // debugger;
    this.setState({ trayWidth });
    setTimeout(this.updateCanvasSize.bind(this), 16);
  }

  updateCanvasSize() {
    var canvasCell = React.findDOMNode(this.refs.canvasCell),
        toolbarLine = React.findDOMNode(this.refs.toolbar),
        footerSize = 38,
        canvasWidth = canvasCell.offsetWidth, //window.innerWidth - this.state.trayWidth,
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
      if (newGraph) {
        this.currentWorkflowGraph = workflowGraph;
      }
      this.refs.tray.refs.inspector.refs.outline.setState({model: workflowGraph});
      this.refs.tray.refs.json.setState({model: workflowTemplate});
      this.loadWorkflowTemplate(workflowGraph, workflowTemplate, this.currentWorkflowGraph, () => {
        this.organizeWorkflowGraphs(workflowGraph._.groupId);
      });
    }, 32);
  }

  loadWorkflowTemplate(workflowGraph, workflowTemplate, parentWorkflowGraph, callback) {
    let workflowGroupId = GCGroup.id(),
        isSubGraph = parentWorkflowGraph && parentWorkflowGraph !== workflowGraph;

    this.workflowGraphs[workflowGroupId] = workflowGraph;

    workflowGraph._ = { isSubGraph, template: workflowTemplate };
    workflowGraph._.groupId = workflowGroupId;

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
      let minSizeY = taskGutter + taskHeight / 2;
      let columns = 4;
      let sizeX = Math.max(minSizeX, taskGutter + (columns * taskWidth) / 2);
      let sizeY = Math.max(minSizeY, taskGutter + (Math.ceil(taskCount / columns) * taskHeight) / 2) + 10;

      let workflowGroup = (
        <GCGroup key={workflowGroupId}
            initialBounds={isSubGraph ? [
              0, 0, sizeX * 2, sizeY * 2
            ] : [
              1500 - sizeX, 1500 - sizeY,
              1500 + sizeX, 1500 + sizeY
            ]}
            initialColor="#777"
            initialName={workflowGraph.friendlyName}
            initialId={workflowGroupId} />
      );

      workflowGraph._.groupElement = workflowGroup;

      // TODO: add handler to remove from this.groups
      if (isSubGraph) {
        parentWorkflowGraph._.subGraphs = parentWorkflowGraph._.subGraphs || [];
        parentWorkflowGraph._.subGraphs.push(workflowGraph);
        parentWorkflowGraph._.groupComponent.appendChild(workflowGroup);
      }
      else {
        this.refs.graphCanvas.refs.world.appendChild(workflowGroup);
      }

      setTimeout(() => {
        let workflowGroupComponent = this.refs.graphCanvas.lookup(workflowGroupId);
        workflowGraph._.groupComponent = workflowGroupComponent;

        // Setup Workflow Nodes
        let taskMap = workflowGraph._.taskMap = {};

        React.withContext({
          graphCanvas: this.refs.graphCanvas,
          parentGCGroup: workflowGroupComponent
        }, () => {
          let workflowOptions = workflowGraph._.options = {},
              optionsNodeId = GCNode.id(),
              optionsPortId = GCPort.id(),
              optionsInId = GCSocket.id(),
              optionsOutId = GCSocket.id();

          workflowOptions.socketIds = {
            in: optionsInId,
            out: optionsOutId
          };

          workflowOptions.element = (
            <GCNode key={optionsNodeId}
                initialBounds={[
                  -200, -200,
                  -200 + taskWidth, -200 + taskHeight
                ]}
                initialColor="green"
                initialId={optionsNodeId}
                initialName={'Options: ' + workflowGraph.friendlyName}>
              <GCPort key={optionsPortId}
                  initialColor="#496"
                  initialId={optionsPortId}
                  initialName="Workflow Options">
                <GCSocket key={optionsInId}
                    dir={[-1, 0]}
                    initialColor="#294"
                    initialId={optionsInId}
                    initialName="In" />
                <GCSocket key={optionsOutId}
                    dir={[1, 0]}
                    initialColor="#272"
                    initialId={optionsOutId}
                    initialName="Out" />
              </GCPort>
            </GCNode>
          );

          workflowGroupComponent.appendChild(workflowOptions.element);
        });

        workflowGraph.tasks.forEach((task, taskNumber) => {
          taskMap[task.label] = task;

          let taskNodeId = GCNode.id(),
              orderPortId = GCPort.id(),
              waitOnId = GCSocket.id(),
              failedId = GCSocket.id(),
              succeededId = GCSocket.id(),
              finishedId = GCSocket.id(),
              optionsPortId = GCPort.id(),
              optionsInId = GCSocket.id(),
              optionsOutId = GCSocket.id();

          task._ = {};
          task._.nodeId = taskNodeId;
          task._.orderSocketIds = {
            waitOn: waitOnId,
            failed: failedId,
            succeeded: succeededId,
            finished: finishedId
          };
          task._.optionsSocketIds = {
            in: optionsInId,
            out: optionsOutId
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
                  initialColor="#ddd"
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
                      initialName="Wait On" />
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
                  <GCSocket key={finishedId}
                      dir={[1, 0]}
                      initialColor="#227"
                      initialId={finishedId}
                      initialName="Finished" />
                </GCPort>
                <GCPort key={optionsPortId}
                    initialColor="#496"
                    initialId={optionsPortId}
                    initialName="Task Options">
                  <GCSocket key={optionsInId}
                      dir={[-1, 0]}
                      initialColor="#294"
                      initialId={optionsInId}
                      initialName="In" />
                  <GCSocket key={optionsOutId}
                      dir={[1, 0]}
                      initialColor="#272"
                      initialId={optionsOutId}
                      initialName="Out" />
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
              let state = task.waitOn[taskLabel],
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
                      initialId={orderLinkId}
                      initialColor="#6cf" />
                );

                links[orderLinkId] = link;

                // TODO: add handler to remove this task from workflowGraph.tasks
                workflowGroupComponent.appendChild(link);
              });
            });
          }
        });

        Object.keys(workflowGraph.options).forEach(optionsKey => {
          let associatedTask = taskMap[optionsKey];
          if (associatedTask) {
            let socketFrom = workflowGraph._.options.socketIds.out,
                socketTo = associatedTask._.optionsSocketIds.in;

            React.withContext({
              graphCanvas: this.refs.graphCanvas,
              parentGCGroup: workflowGroupComponent
            }, () => {
              let optionsLinkId = GCLink.id();

              let link = (
                <GCLink key={optionsLinkId}
                    from={socketFrom}
                    to={socketTo}
                    initialId={optionsLinkId}
                    initialColor="#6fc" />
              );

              links[optionsLinkId] = link;

              // TODO: add handler to remove this task from workflowGraph.tasks
              workflowGroupComponent.appendChild(link);
            });
          }
        });

        if (workflowGraph.options.defaults) {
          Object.keys(workflowGraph.options.defaults).forEach(optionKey => {
            let associatedTasks = [];
            workflowGraph.tasks.forEach(task => {
              let taskDefinition = this.getTaskDefinitionFromTask(task);
              if (taskDefinition && taskDefinition.options && taskDefinition.options.hasOwnProperty(optionKey)) {
                associatedTasks.push(task);
              }
            });
            associatedTasks.forEach(associatedTask => {
              let socketFrom = workflowGraph._.options.socketIds.out,
                  socketTo = associatedTask._.optionsSocketIds.in;

              React.withContext({
                graphCanvas: this.refs.graphCanvas,
                parentGCGroup: workflowGroupComponent
              }, () => {
                let optionsLinkId = GCLink.id();

                let link = (
                  <GCLink key={optionsLinkId}
                      from={socketFrom}
                      to={socketTo}
                      initialId={optionsLinkId}
                      initialColor="#6fc" />
                );

                links[optionsLinkId] = link;

                // TODO: add handler to remove this task from workflowGraph.tasks
                workflowGroupComponent.appendChild(link);
              });
            });
          });
        }

        if (callback) { setTimeout(callback, 32); }
      }, 32);
    });
  }

  organizeWorkflowGraphs() {
    Object.keys(this.workflowGraphs).forEach(workflowGraphId => {
      this.organizeWorkflowGraph(workflowGraphId);
      // TODO: resize and arrange groups
    });
  }

  organizeWorkflowGraph(workflowGraphId, callback) {
    let workflowGraph = this.workflowGraphs[workflowGraphId];
    let taskMap = {};

    workflowGraph.tasks.forEach(task => taskMap[task.label] = task);

    let columns = [workflowGraph.tasks.filter(task => !task.waitOn)];

    function findMaxDepth(task, depth=0) {
      if (!task.waitOn) { return depth; }
      depth += 1;
      var depths = Object.keys(task.waitOn).map(taskLabel => {
        var nextTask = taskMap[taskLabel];
        return findMaxDepth(nextTask, depth);
      });
      return Math.max.apply(Math, depths);
    }

    workflowGraph.tasks.filter(task => task.waitOn).forEach(task => {
      var column = findMaxDepth(task);
      columns[column] = columns[column] || [];
      columns[column].push(task);
    });

    let numRows = 0,
        numCols = 0;

    columns = columns.filter(column => {
      if (column) {
        numCols += 1;
        numRows = Math.max(column.length, numRows);
        return true;
      }
    });

    if (numRows < 2) {
      if (callback) { callback(); }
      return;
    }

    columns.forEach((column, c) => {
      column.forEach((task, i) => {
        let nodeComponent = this.refs.graphCanvas.lookup(task._.nodeId);
        let x = 350 * c + 30;
        let y = 250 * i + 30;
        nodeComponent.refs.panel.updateBounds(
          new Rectangle([
            x, y,
            x + 320, y + 220
          ])
        );
      });
    });

    setTimeout(() => {
      Object.keys(workflowGraph._.links).forEach(linkId => {
        let link = this.refs.graphCanvas.lookup(linkId);
        link.updateBounds();
      });

      let isSubGraph = workflowGraph._.isSubGraph,
          workflowGraphComponent = workflowGraph._.groupComponent,
          workflowGraphSizeX = (numCols * 350 + 30) / 2,
          workflowGraphSizeY = (numRows * 250 + 30 + 50) / 2;

      workflowGraphComponent.refs.panel.updateBounds(
        new Rectangle(isSubGraph ? [
          0, 0, workflowGraphSizeX * 2, workflowGraphSizeY * 2
        ] : [
          1500 - workflowGraphSizeX, 1500 - workflowGraphSizeY,
          1500 + workflowGraphSizeX, 1500 + workflowGraphSizeY
        ])
      );

      if (callback) { setTimeout(callback, 32); }
    }, 32);
  }

}
