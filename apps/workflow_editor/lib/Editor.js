'use strict';

import { EventEmitter } from 'events';

import Rectangle from 'common-web-ui/lib/Rectangle';
import Graph from 'common-web-ui/lib/Graph';

import TaskStore from '../stores/TaskStore';
import WorkflowStore from '../stores/WorkflowStore';

import Task from './Task';
import Workflow from './Workflow';

export default class Editor extends EventEmitter {

  constructor(layout) {
    super();
    this.graph = new Graph();
    this.layout = layout;
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
    var workflowGraph = this.loadWorkflowTemplate(workflowTemplate, newGraph);
        // graphCanvas = this.layout.refs.graphCanvas;
    this.graph = workflowGraph;
    this.emitGraphUpdate();
    // graphCanvas.refs.world.updateGraph(this.graph);
  }

  resetWorkflow() {
    this.graph = new Graph();
    this.emitGraphUpdate();
    // var graphCanvas = this.layout.refs.graphCanvas;
    // graphCanvas.refs.world.updateGraph(this.graph);
  }

  loadWorkflowTemplate(workflowTemplate, newGraph) {
    var workflowGraph = newGraph ? new Graph() : this.graph,
        taskMap = {};
    workflowTemplate.tasks.forEach(task => {
      task._node = workflowGraph.add({
        graph: workflowGraph,
        data: {task: task},
        bounds: [900, 900, 1000, 1000],
        layer: 0,
        scale: 1,
        ports: [
          {name: 'Flow', sockets: [
            {type: 'waitOn', dir: [-1, 0]},
            {type: 'failed', dir: [1, 0]},
            {type: 'succeeded', dir: [1, 0]},
            {type: 'finished', dir: [1, 0]}
          ]}
        ]
      });
      taskMap[task.label] = task;
    });
    workflowTemplate.tasks.forEach(task => {
      if (task.waitOn) {
        Object.keys(task.waitOn).forEach(taskLabel => {
          var state = task.waitOn[taskLabel];
          var linkedTask = taskMap[taskLabel];
          workflowGraph.connect({
            graph: workflowGraph,
            data: {
              bounds: new Rectangle([1000, 1000, 1000, 1000]),
              from: linkedTask._node.id,
              to: task._node.id
            },
            socketOut: linkedTask._node.ports.Flow.sockets[state],
            socketIn: task._node.ports.Flow.sockets.waitOn,
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
