'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

// import { Paper } from 'material-ui';
import Rectangle from 'common-web-ui/lib/Rectangle';
import Graph from 'common-web-ui/lib/Graph';
import GraphCanvas from 'common-web-ui/components/GraphCanvas';
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
          <WorkflowBuilderToolbar editor={this} />
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
  }

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
  }

  resetWorkflow() {
    this.refs.graphCanvas.refs.world.updateGraph(new Graph());
  }

}
