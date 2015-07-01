'use strict';

import Rectangle from 'common-web-ui/lib/Rectangle';
import Graph from 'common-web-ui/lib/Graph';

export default {
  loadWorkflow(workflow) {
    var workflowGraph = new Graph(),
        taskMap = {};
    workflow.tasks.forEach(task => {
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
    workflow.tasks.forEach(task => {
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
    this.organizeWorkflow(workflow, taskMap);
    this.refs.graphCanvas.refs.world.updateGraph(workflowGraph);
  },

  organizeWorkflow(workflow, taskMap) {
    var columns = [workflow.tasks.filter(task => !task.waitOn)];
    function findMaxDepth(task, depth=0) {
      if (!task.waitOn) { return depth; }
      depth += 1;
      var depths = Object.keys(task.waitOn).map(taskLabel => {
        var nextTask = taskMap[taskLabel];
        return findMaxDepth(nextTask, depth);
      });
      return Math.max.apply(Math, depths);
    }
    workflow.tasks.filter(task => task.waitOn).forEach(task => {
      var column = findMaxDepth(task);
      columns[column] = columns[column] || [];
      columns[column].push(task);
    });
    console.log('columns', columns);
    columns.forEach((column, c) => {
      if (column) {
        column.forEach((task, i) => {
          task._node.bounds.translate([150 * c, 120 * i]);
        });
      }
    });
  },

  resetWorkflow() {
    this.refs.graphCanvas.refs.world.updateGraph(new Graph());
  }
};
