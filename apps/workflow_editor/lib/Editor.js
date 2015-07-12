'use strict';

import { EventEmitter } from 'events';

import cloneDeep from 'lodash/lang/cloneDeep';

import Rectangle from 'graph-canvas-web-ui/lib/Rectangle';
import Graph from 'graph-canvas-web-ui/lib/Graph';

import TaskStore from '../stores/TaskStore';
import WorkflowStore from '../stores/WorkflowStore';

import Task from './Task';
import Workflow from './Workflow';

export default class Editor extends EventEmitter {

  constructor(layout) {
    super();
    this.graph = new Graph();
    this.layout = layout;
    this.workflow = new Workflow({});
    this.tasks = [];
    this.taskStore = new TaskStore(Task);
    this.workflowStore = new WorkflowStore(Workflow);
  }

  onGraphUpdate(handler) {
    this.on('graph', handler);
  }

  emitGraphUpdate() {
    this.emit('graph', this.graph);
  }

  loadWorkflow(workflowTemplate, newGraph) {
    workflowTemplate = cloneDeep(workflowTemplate);
    var workflowGraph = this.loadWorkflowTemplate(workflowTemplate, newGraph);
    this.graph = workflowGraph;
    this.workflow = new Workflow(workflowTemplate);
    this.workflow.insertGraphNode(this, workflowTemplate.friendlyName, [1100, 1200, 1200, 1300]);
    this.emitGraphUpdate();
  }

  resetWorkflow() {
    this.graph = new Graph();
    this.emitGraphUpdate();
  }

  loadWorkflowTemplate(workflowTemplate, newGraph) {
    var workflowGraph = newGraph ? new Graph() : this.graph,
        taskMap = {};
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
        ports: [
          {
            name: 'Options',
            color: 'red',
            sockets: [
              {type: 'IN', dir: [-1, 0]},
              {type: 'OUT', dir: [1, 0]}
            ]
          },
          {
            name: 'Flow',
            color: 'blue',
            sockets: [
              {type: 'waitOn', dir: [-1, 0]},
              {type: 'failed', dir: [1, 0]},
              {type: 'succeeded', dir: [1, 0]},
              {type: 'finished', dir: [1, 0]}
            ]
          }
        ]
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
