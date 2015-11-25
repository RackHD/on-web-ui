// Copyright 2015, EMC, Inc.

'use strict';

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import radium from 'radium';

import cloneDeep from 'lodash/lang/cloneDeep';

import { CircularProgress } from 'material-ui';

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
export default class WorkflowEditor extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    styles: PropTypes.object
  };

  static defaultProps = {
    className: '',
    css: {},
    styles: {}
  };

  static contextTypes = {
    appContainer: PropTypes.any
  };

  static childContextTypes = {
    layout: PropTypes.any,
    editor: PropTypes.any
  };

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
    loading: true,
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
      textAlign: 'center',
      position: 'absolute',
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
    this.context.appContainer.fullscreenMode(true);
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
    this.context.appContainer.fullscreenMode(false);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    this.handleResize = null;
    document.body.classList.remove('no-select');
  }

  componentWillReceiveProps(nextProps) {
    this.loadWorkflowFromParams(nextProps);
  }

  render() {
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
        <div ref="overlay" className="overlay" style={css.overlay}>
          {this.state.loading ? <CircularProgress mode="indeterminate" size={2} style={{marginTop: 200}}/> : null}
        </div>
      </div>
    );
  }

  newGraphCanvas() {
    this.workflowGraphs = {};
    return <GraphCanvas
        key={'graphCanvas' + this.state.version}
        ref="graphCanvas"
        grid={null}
        initialScale={0.5}
        viewWidth={this.state.canvasWidth}
        viewHeight={this.state.canvasHeight}
        worldWidth={3000}
        worldHeight={3000}
        onSelect={this.onSelect.bind(this)}
        onLink={this.addLink.bind(this)}
        onUnlink={this.removeLink.bind(this)} />;
  }

  onSelect(selection) {}

  resetWorkflow() {
    this.currentWorkflowGraph = this.currentWorkflowGraph || {
      friendlyName: 'New Workflow',
      injectableName: 'Graph.New.Workflow',
      options: {
        defaults: {
          parameter: null
        }
      },
      tasks: [
        {
          label: 'new-task',
          taskDefinition: {
            friendlyName: 'New Task',
            injectableName: 'Task.Base.New',
            options: {
              parameter: null
            },
            properties: {}
          }
        }
      ]
    };
    this.setState(prevState => ({version: prevState.version + 1}));
    try {
      // this.refs.tray.refs.inspector.refs.outline.setState({model: {}});
      this.refs.tray.refs.json.setState({model: {}});
    } catch (err) {
      console.warn(err.stack || err);
    }
  }

  updateTraySize(trayWidth) {
    // debugger;
    this.setState({ trayWidth });
    setTimeout(this.updateCanvasSize.bind(this), 16);
  }

  updateCanvasSize() {
    var canvasCell = findDOMNode(this.refs.canvasCell),
        toolbarLine = findDOMNode(this.refs.toolbar),
        canvasWidth = canvasCell.offsetWidth,
        canvasHeight = window.innerHeight - 120
    if (this.state.canvasWidth !== canvasWidth) { this.setState({ canvasWidth }); }
    if (this.state.canvasHeight !== canvasHeight) { this.setState({ canvasHeight }); }
  }

  loadWorkflowFromParams(props) {
    props = props || this.props;
    this.setState({loading: true});
    setTimeout(() => {
      if (props.params && props.params.workflow && props.params.workflow !== 'New Workflow') {
        let workflowName = decodeURIComponent(props.params.workflow);
        Promise.all([
          this.taskDefinitionStore.list(),
          this.workflowTemplateStore.list()
        ]).then(() => {
          this.setState({loading: false});
          let workflowTemplate = this.editor.getWorkflowTemplateByName(workflowName);
          if (workflowTemplate) { this.loadWorkflow(workflowTemplate, true); }
        });
      }
      else {
        this.setState({loading: false});
        this.refreshWorkflow(this.currentWorkflowGraph);
      }
    }, 50);
  }

  refreshWorkflow(callback) {
    this.resetWorkflow();
    setTimeout(() => {
      this.loadWorkflowGraph(this.currentWorkflowGraph, callback);
    }, 32);
  }

  loadWorkflow(workflowTemplate, newGraph, callback) {
    if (newGraph) { this.resetWorkflow(); }
    setTimeout(() => {
      let workflowGraph = cloneDeep(workflowTemplate);
      if (newGraph) {
        this.currentWorkflowGraph = workflowGraph;
      }
      this.loadWorkflowGraph(workflowGraph, callback);
    }, 32);
  }

  loadWorkflowGraph(workflowGraph, callback) {
    // this.refs.tray.refs.json.setState({model: workflowTemplate});
    this.loadWorkflowTemplate(workflowGraph, this.currentWorkflowGraph, () => {
      this.organizeWorkflowGraphs(workflowGraph._.groupId);
      this.refs.tray.refs.json.setState({model: workflowGraph});
      if (callback) { callback(workflowGraph); }
    });
  }

  loadWorkflowTemplate(workflowGraph, parentWorkflowGraph, callback) {
    let workflowGroupId = GCGroup.id(),
        isSubGraph = parentWorkflowGraph && parentWorkflowGraph !== workflowGraph;

    this.workflowGraphs[workflowGroupId] = workflowGraph;

    workflowGraph._ = { isSubGraph };
    workflowGraph._.groupId = workflowGroupId;

    let taskCount = workflowGraph.tasks.length + 1;
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
          initialColor="#bbb"
          initialName={workflowGraph.friendlyName}
          initialId={workflowGroupId}
          isRemovable={false}
          onChange={this.changeTask.bind(this, workflowGraph)} />
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

      let workflowOptions = workflowGraph._.options = {},
          optionsNodeId = GCNode.id(),
          defaultOptionsPortId = GCPort.id(),
          defaultOptionsInId = GCSocket.id(),
          defaultOptionsOutId = GCSocket.id(),
          specificOptionsPortId = GCPort.id(),
          specificOptionsInId = GCSocket.id(),
          specificOptionsOutId = GCSocket.id();

      workflowOptions.defaultOptionsPortId = defaultOptionsPortId;
      workflowOptions.specificOptionsPortId = specificOptionsPortId;

      workflowOptions.defaultSocketIds = {
        in: defaultOptionsInId,
        out: defaultOptionsOutId
      };
      workflowOptions.specificSocketIds = {
        in: specificOptionsInId,
        out: specificOptionsOutId
      };

      workflowOptions.element = (
        <GCNode key={optionsNodeId}
            initialBounds={[
              0, 0,
              taskWidth, taskHeight
            ]}
            initialColor="#6c8"
            initialId={optionsNodeId}
            initialName={'Options: ' + workflowGraph.friendlyName}
            isRemovable={false}>
          <GCPort key={defaultOptionsPortId}
              initialColor="#496"
              initialId={defaultOptionsPortId}
              initialName="Workflow Options (Defaults)">
            <GCSocket key={defaultOptionsInId}
                dir={[-1, 0]}
                initialColor="#294"
                initialId={defaultOptionsInId}
                initialName="In" />
            <GCSocket key={defaultOptionsOutId}
                dir={[1, 0]}
                initialColor="#272"
                initialId={defaultOptionsOutId}
                initialName="Out" />
          </GCPort>
          <GCPort key={specificOptionsPortId}
              initialColor="#496"
              initialId={specificOptionsPortId}
              initialName="Workflow Options (Specifics)">
            <GCSocket key={specificOptionsInId}
                dir={[-1, 0]}
                initialColor="#294"
                initialId={specificOptionsInId}
                initialName="In" />
            <GCSocket key={specificOptionsOutId}
                dir={[1, 0]}
                initialColor="#272"
                initialId={specificOptionsOutId}
                initialName="Out" />
          </GCPort>
        </GCNode>
      );

      workflowGroupComponent.appendChild(workflowOptions.element);

      workflowGraph.tasks.forEach((task, taskNumber) => {
        taskNumber += 1;
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
        task._.orderPortId = orderPortId;
        task._.orderSocketIds = {
          waitOn: waitOnId,
          failed: failedId,
          succeeded: succeededId,
          finished: finishedId
        };
        task._.optionsPortId = optionsPortId;
        task._.optionsSocketIds = {
          in: optionsInId,
          out: optionsOutId
        };

        task._.definition = this.getTaskDefinitionFromTask(task);
        // TODO: figure out how to link a nested workflow to a task.
        // let definition = task._.definition
        // if (definition && definition.implementsTask && definition.implementsTask.indexOf('Graph.Run') !== -1) {
        //   let nestedWorkflowTemplate = this.getWorkflowTemplateByName(definition.options.graphName);
        //   if (nestedWorkflowTemplate) {
        //     this.loadWorkflow(nestedWorkflowTemplate, false, (linkedWorkflowGraph) => {
        //       task._.linkedWorkflow = linkedWorkflowGraph;
        //     });
        //   }
        // }

        let row = Math.floor(taskNumber / columns),
            col = taskNumber % columns;

        let taskNode = (
          <GCNode key={taskNodeId}
              initialBounds={[
                taskGutter + (col * taskWidth), taskGutter + (row * taskHeight),
                taskWidth + (col * taskWidth), taskHeight + (row * taskHeight)
              ]}
              initialColor="#999"
              initialId={taskNodeId}
              initialName={task.label}
              onRemove={this.removeTask.bind(this, workflowGraph, task)}
              onChange={this.changeTask.bind(this, workflowGraph, task)}>
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

      // Setup Workflow Links
      let links = workflowGraph._.links = {};
      workflowGraph.tasks.forEach(task => {
        if (task.waitOn) {
          Object.keys(task.waitOn).forEach(taskLabel => {
            let state = task.waitOn[taskLabel],
                linkedTask = taskMap[taskLabel],
                socketFrom = task._.orderSocketIds.waitOn,
                socketTo = linkedTask._.orderSocketIds[state];

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
        }
      });

      // Specific Options Link Setup
      if (workflowGraph.options) {
        Object.keys(workflowGraph.options).forEach(optionsKey => {
          let associatedTask = taskMap[optionsKey];
          if (associatedTask) {
            let socketFrom = workflowGraph._.options.specificSocketIds.out,
                socketTo = associatedTask._.optionsSocketIds.in;

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
          }
        });

        // Default Options Link Setup
        if (workflowGraph.options.defaults) {
          Object.keys(workflowGraph.options.defaults).forEach(optionKey => {
            let associatedTasks = [];
            workflowGraph.tasks.forEach(task => {
              let taskDefinition = task._.definition;
              if (taskDefinition && taskDefinition.options && taskDefinition.options.hasOwnProperty(optionKey)) {
                associatedTasks.push(task);
              }
            });
            associatedTasks.forEach(associatedTask => {
              let socketFrom = workflowGraph._.options.defaultSocketIds.out,
                  socketTo = associatedTask._.optionsSocketIds.in;

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
        }
      }

      if (callback) { setTimeout(callback, 32); }
    }, 32);
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

    let columns = [true, workflowGraph.tasks.filter(task => !task.waitOn)];

    function findMaxDepth(task, depth=0) {
      if (!task.waitOn) { return depth; }
      depth += 1;
      var depths = Object.keys(task.waitOn).map(taskLabel => {
        var nextTask = taskMap[taskLabel];
        return findMaxDepth(nextTask, depth);
      });
      return Math.max.apply(Math, depths) + 1;
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
        if (column === true) { return true; }
        numRows = Math.max(column.length, numRows);
        return true;
      }
    });

    if (numRows < 2) {
      if (callback) { callback(); }
      return;
    }

    columns.forEach((column, c) => {
      if (column === true) { return; }
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

  addTask(taskDefinition, label) {
    this.currentWorkflowGraph.tasks.push({
      label: label,
      taskDefinition: taskDefinition
    });
    this.refreshWorkflow();
  }

  changeTask(workflow, task, node, panel) {
    if (panel.state.name !== task.label) {
      this.renameTask(workflow, task, panel.state.name);
    }
  }

  renameTask(workflow, task, newName) {
    let oldName = task.label;
    if (workflow && workflow.tasks) {
      workflow.tasks.forEach(t => {
        if (t.waitOn && t.waitOn === oldName) {
          t.waitOn[newName] = t.waitOn[oldName];
          delete t.waitOn[oldName];
        }
      });
    }
    task.label = newName;
    clearTimeout(this.renameTaskUpdateTimer);
    this.renameTaskUpdateTimer = setTimeout(() => {
      this.refreshWorkflow();
    }, 1500);
  }

  removeTask(workflow, task) {
    let index = workflow.tasks.indexOf(task);
    if (index !== -1) {
      workflow.tasks.splice(index, 1);
    }
    clearTimeout(this.removeTaskUpdateTimer);
    this.removeTaskUpdateTimer = setTimeout(() => {
      this.refreshWorkflow();
    }, 500);
  }

  changeWorkflow(workflow, group, panel) {
    if (panel.state.name !== workflow.friendlyName) {
      this.renameWorkflow(workflow, panel.state.name);
    }
  }

  renameWorkflow(workflow, newName) {
    workflow.friendlyName = newName;
    clearTimeout(this.renameWorkflowUpdateTimer);
    this.renameWorkflowUpdateTimer = setTimeout(() => {
      this.refreshWorkflow();
    }, 1500);
  }

  removeWorkflow(/*workflow, group*/) {
    // TODO
  }

  getSocketDetailsById(socketId) {
    // debugger;
    let graph = this.currentWorkflowGraph,
        task = null,
        socketLabel = null,
        portId = null,
        portType = null;
    if (
      graph._.options.defaultSocketIds.in === socketId ||
      graph._.options.defaultSocketIds.out === socketId
    ) {
      task = 'options';
      socketLabel = 'out'; // TODO:
      portId = graph._.options.defaultOptionsPortId;
      portType = 'defaultOtions';
    }
    else if (
      graph._.options.specificSocketIds.in === socketId ||
      graph._.options.specificSocketIds.out === socketId
    ) {
      task = 'options';
      socketLabel = 'out'; // TODO:
      portId = graph._.options.specificOptionsPortId;
      portType = 'specificOptions';
    }
    graph.tasks.forEach(t => {
      if (task) { return; }
      let match = Object.keys(t._.optionsSocketIds).some(k => {
        if (t._.optionsSocketIds[k] === socketId) {
          socketLabel = k;
          return true;
        }
      });
      if (match) {
        task = t;
        portId = t._.optionsPortId;
        portType = 'taskOptions';
        return;
      }
      match = Object.keys(t._.orderSocketIds).some(k => {
        if (t._.orderSocketIds[k] === socketId) {
          socketLabel = k;
          return true;
        }
      });
      if (match) {
        task = t;
        portId = t._.orderPortId;
        portType = 'taskOrder';
      }
    });
    return {
      task: task,
      portId: portId,
      portType: portType,
      socketLabel: socketLabel
    };
  }

  addLink(link) {
    // console.log(link);
    let fromSocketDetails = this.getSocketDetailsById(link.fromSocket.id),
        toSocketDetails = this.getSocketDetailsById(link.toSocket.id);
    if (fromSocketDetails.portType === 'taskOrder') {
      if (toSocketDetails.portType === 'taskOrder') {
        if (fromSocketDetails.task !== toSocketDetails.task) {
          if (link.fromSocket.props.dir[0] === -1 && link.toSocket.props.dir[0] === 1) {
            fromSocketDetails.task.waitOn = fromSocketDetails.task.waitOn || {};
            fromSocketDetails.task.waitOn[toSocketDetails.task.label] = toSocketDetails.socketLabel;
          }
          else if (link.toSocket.props.dir[0] === -1 && link.fromSocket.props.dir[0] === 1) {
            toSocketDetails.task.waitOn = toSocketDetails.task.waitOn || {};
            toSocketDetails.task.waitOn[fromSocketDetails.task.label] = fromSocketDetails.socketLabel;
          }
        }
      }
    }
    // debugger;
    clearTimeout(this.linksUpdateTimer);
    this.linksUpdateTimer = setTimeout(() => {
      this.refreshWorkflow();
    }, 1500);
  }

  removeLink(link) {
    // console.log(link);
    clearTimeout(this.linksUpdateTimer);
    let fromSocketDetails = this.getSocketDetailsById(link.fromSocket.id),
        toSocketDetails = this.getSocketDetailsById(link.toSocket.id);
    if (fromSocketDetails.portType === 'taskOrder') {
      if (toSocketDetails.portType === 'taskOrder') {
        if (fromSocketDetails.task !== toSocketDetails.task) {
          if (link.fromSocket.props.dir[0] === -1 && link.toSocket.props.dir[0] === 1) {
            fromSocketDetails.task.waitOn = fromSocketDetails.task.waitOn || {};
            delete fromSocketDetails.task.waitOn[toSocketDetails.task.label];
          }
          else if (link.toSocket.props.dir[0] === -1 && link.fromSocket.props.dir[0] === 1) {
            toSocketDetails.task.waitOn = toSocketDetails.task.waitOn || {};
            delete toSocketDetails.task.waitOn[fromSocketDetails.task.label];
          }
        }
      }
    }
    // debugger;
    clearTimeout(this.linksUpdateTimer);
    this.linksUpdateTimer = setTimeout(() => {
      this.refreshWorkflow();
    }, 1500);
  }

}
