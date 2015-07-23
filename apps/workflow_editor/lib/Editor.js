'use strict';

import { EventEmitter } from 'events';

import cloneDeep from 'lodash/lang/cloneDeep';

import Rectangle from 'graph-canvas-web-ui/lib/Rectangle';

import TaskDefinitionStore from '../stores/TaskDefinitionStore';
import WorkflowTemplateStore from '../stores/WorkflowTemplateStore';

import TaskDefinition from './TaskDefinition';
import WorkflowTemplate from './WorkflowTemplate';

import TaskNode from './TaskNode';
import WorkflowGraph from './WorkflowGraph';

export default class Editor extends EventEmitter {

  constructor(layout) {
    super();
    this.layout = layout;

    this.workflowGraph = new WorkflowGraph(this);
    this.taskNodes = [];

    this.taskDefinitionStore = new TaskDefinitionStore(TaskDefinition);
    this.workflowTemplateStore = new WorkflowTemplateStore(WorkflowTemplate);
  }

  getTaskDefinitionByName(name) {
    return this.taskDefinitionStore.collection[name];
  }

  getWorkflowTemplateByName(name) {
    return this.workflowTemplateStore.collection[name];
  }

  onGraphUpdate(handler) {
    this.on('graphUpdate', handler);
  }

  emitGraphUpdate() {
    this.emit('graphUpdate');
  }

  loadWorkflow(workflowTemplate, newGraph) {
    workflowTemplate = cloneDeep(workflowTemplate);
    var workflowGraph = this.loadWorkflowTemplate(workflowTemplate, newGraph);
    this.graph = workflowGraph;
    this.workflowGraph = new WorkflowGraph(this, workflowTemplate, workflowTemplate.friendlyName);
    this.workflowGraph.addGraphCanvasNode([1100, 1200, 1200, 1300]);
    this.emitGraphUpdate();
  }

  resetWorkflow() {
    this.emitGraphUpdate();
  }

  loadWorkflowTemplate(workflowTemplate, newGraph) {
    var taskMap = {};
    this.tasks = [];
    workflowTemplate.tasks.forEach(task => {
      task._node = workflowGraph.add({
        graph: workflowGraph,
        data: {
          task: task
        },
        bounds: [1300, 1300, 1400, 1400],
        layer: 1,
        scale: 1,
        ports: TaskNode.prototype.gcPorts
      });
      taskMap[task.label] = task;
      this.tasks.push(task);
    });
    workflowTemplate.tasks.forEach(task => {
      if (task.waitOn) {
        Object.keys(task.waitOn).forEach(taskLabel => {
          var state = task.waitOn[taskLabel],
              linkedTask = taskMap[taskLabel],
              socketOut = linkedTask._node.ports.Flow.sockets[state],
              socketIn = task._node.ports.Flow.sockets.waitOn;
          workflowGraph.connect({
            graph: workflowGraph,
            data: {
              bounds: new Rectangle([1000, 1000, 1000, 1000]),
              from: linkedTask._node.id,
              to: task._node.id
            },
            socketOut: socketOut,
            socketIn: socketIn,
            layer: 0,
            scale: 1
          });
        });
      }
    });
    this.organizeWorkflowTemplateWithTaskMap(workflowTemplate, taskMap);
    return workflowGraph;
  }

  organizeWorkflowTemplateWithTaskMap(workflowTemplate, taskMap) {
    var columns = [workflowTemplate.tasks.filter(task => !task.waitOn)];
    function findMaxDepth(task, depth=0) {
      if (!task.waitOn) { return depth; }
      depth += 1;
      var depths = Object.keys(task.waitOn).map(taskLabel => {
        var nextTask = taskMap[taskLabel];
        return findMaxDepth(nextTask, depth);
      });
      return Math.max.apply(Math, depths);
    }
    workflowTemplate.tasks.filter(task => task.waitOn).forEach(task => {
      var column = findMaxDepth(task);
      columns[column] = columns[column] || [];
      columns[column].push(task);
    });
    columns.forEach((column, c) => {
      if (column) {
        column.forEach((task, i) => {
          task._node.bounds.translate([150 * c, 120 * i]);
        });
      }
    });
  }

}
