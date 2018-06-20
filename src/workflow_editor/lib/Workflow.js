// Copyright 2015, EMC, Inc.

import React from 'react';

import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

import {
    GCGroup,
    GCLink,
    GCNode,
    GCPort,
    GCSocket
  } from 'src-graph-canvas/views/GraphCanvas';

import Rectangle from 'src-graph-canvas/lib/Rectangle';

import ObjectDiff from './ObjectDiff';

export default class Workflow {

  constructor(template) {
    template = template || {};
    this.meta = {
      bounds: null,
      cols: null,
      columns: null,
      groupId: null,
      height: null,
      isSubGraph: null,
      links: null,
      nodes: null,
      rows: null,
      width: null
    };
    this.tasks = [];
    merge(this, template);
    delete template.meta;
    this.template = template;
    this.json = cloneDeep(template);
    delete this.json.id;
    this.cleanTasks();
  }

  cleanTasks(customTaskList) {
    let nullTasks = (t) => {
      if (!t || Object.keys(t).length === 0) return false;
      if (t.waitOn && Object.keys(t.waitOn).length === 0) {
        delete t.waitOn;
      }
      return true;
    };
    let taskSort = (a, b) => {
      if (a.label > b.label) return -1;
      if (a.label < b.label) return 1;
      return 0;
    };
    let filter = (array, func) => {
      if (Array.isArray(array)) { return array.filter(func); }
      if (array) {
        return Array.prototype.slice.call(array, 0).filter(func);
      }
    };
    this.tasks = filter(this.tasks, nullTasks).sort(taskSort);
    if (this.template.tasks) {
      this.template.tasks = filter(this.template.tasks, nullTasks).sort(taskSort);
    }
    if (this.json.tasks) {
      this.json.tasks = filter(this.json.tasks, nullTasks).sort(taskSort);
    }
    if (customTaskList) {
      return filter(customTaskList, nullTasks).sort(taskSort);
    }
  }

  get source() {
    return JSON.stringify(this.json, '\t', 2) + '\n';
  }

  refresh(viewContext, source, callback) {
    this.cleanTasks();
    viewContext.workflowOperator.emitWorkflowChange(source);
    if (callback) { callback(); }
  }

  graphUpdate(viewContext, callback) {
    this.mergeGraph();
    this.refresh(viewContext, 'graph', callback);
  }

  mergeGraph() {
    this.cleanTasks();
    let objectDiff = new ObjectDiff(),
        patches = objectDiff.diff(this.json, this.template);
    objectDiff.patch(this.json, patches);
    delete this.json.id;
    objectDiff.patch(this, patches);
  }

  jsonUpdate(viewContext, newJsonObject, callback) {
    this.mergeJson(newJsonObject);
    this.refresh(viewContext, 'json', callback);
  }

  mergeJson(newJsonObject) {
    if (!newJsonObject) { return; }
    newJsonObject.tasks = this.cleanTasks(newJsonObject.tasks);
    let objectDiff = new ObjectDiff(),
        patches = objectDiff.diff(this.json, newJsonObject);
    objectDiff.patch(this.json, patches);
    delete this.json.id;
    objectDiff.patch(this.template, patches);
    objectDiff.patch(this, patches);
  }

  addTask(graphContext, taskDefinition, label) {
    this.cleanTasks();

    let task = { label };

    if (taskDefinition) {
      task.taskDefinition = taskDefinition;
    }
    else {
      task.taskName = 'Task.noop';
    }

    this.template.tasks.push(task);

    this.graphUpdate(graphContext);
  }

  changeTask(graphContext, node, nodeView, panelView) {
    if (panelView.state.name !== node.task.label) {
      this.renameTask(graphContext, node.task.label, panelView.state.name);
    }
  }

  renameTask(graphContext, oldName, newName) {
    this.template.tasks.forEach(task => {
      if (task.label === oldName) {
        task.label = newName;
      }

      if (task.waitOn && task.waitOn[oldName]) {
        task.waitOn[newName] = task.waitOn[oldName];
        delete task.waitOn[oldName];
      }
    });

    this.graphUpdate(graphContext);
  }

  removeTask(graphContext, node) {
    this.cleanTasks();

    let index = this.tasks.indexOf(node.task);

    if (index !== -1) {
      this.template.tasks[index] = null;
    }

    this.graphUpdate(graphContext);
  }

  changeWorkflow(graphContext, groupView, panelView) {
    if (panelView.state.name !== this.friendlyName) {
      this.renameWorkflow(graphContext, panelView.state.name);
    }
  }

  renameWorkflow(graphContext, newName) {
    this.template.friendlyName = newName;
    this.template.injectableName =
      this.injectableName || 'Graph.' + newName.replace(' ', '.');
    this.graphUpdate(graphContext);
  }

  renderGraph(graphContext, parentWorkflow) {
    if (!parentWorkflow) {
      this.loadGraph(graphContext, parentWorkflow);
    }

    let nodes = Object.keys(this.meta.nodes).map(label => {
      let node = this.meta.nodes[label];

      let orderPortId = GCPort.id(),
          waitOnId = GCSocket.id(),
          failedId = GCSocket.id(),
          succeededId = GCSocket.id(),
          finishedId = GCSocket.id();

      node.orderPortId = orderPortId;
      node.orderSocketIds = {
        waitOn: waitOnId,
        failed: failedId,
        succeeded: succeededId,
        finished: finishedId
      };

      let leftSockets = [
        <GCSocket key={waitOnId}
          dir={[-1, 0]}
          initialColor="#6cf"
          initialId={waitOnId}
          initialName="Wait On"
          hideLabel={true} />
      ];

      let rightSockets = [
        <GCSocket key={failedId}
            dir={[1, 0]}
            style={{float: 'right', clear: 'right'}}
            initialColor="red"
            initialId={failedId}
            initialName="Failed"
            hideLabel={true} />,
        <GCSocket key={succeededId}
            dir={[1, 0]}
            style={{float: 'right', clear: 'right'}}
            initialColor="green"
            initialId={succeededId}
            initialName="Succeeded"
            hideLabel={true} />,
        <GCSocket key={finishedId}
            dir={[1, 0]}
            style={{float: 'right', clear: 'right'}}
            initialColor="#6cf"
            initialId={finishedId}
            initialName="Finished"
            hideLabel={true} />
      ];

      let GCElement = node.workflow ? GCGroup : GCNode;

      return (
        <GCElement key={node.id}
            initialBounds={node.bounds}
            initialColor="#999"
            initialId={node.id}
            initialName={node.task.label}
            onRemove={this.removeTask.bind(this, graphContext, node)}
            onChange={this.changeTask.bind(this, graphContext, node)}
            leftSockets={leftSockets}
            rightSockets={rightSockets}>
          {node.workflow && node.workflow.renderGraph(graphContext, this)}
        </GCElement>
      );
    });

    let links = Object.keys(this.meta.links).map(label => {
      let link = this.meta.links[label],
          { source, target } = link;

      if (!source || !target) { return null; }

      let color = ({failed: 'red', succeeded: 'green', 'finished': '#6cf'})[link.waitOn];

      return (
        <GCLink key={link.id}
            from={link.source.orderSocketIds.waitOn}
            to={link.target.orderSocketIds[link.waitOn]}
            isRemovable={true}
            initialId={link.id}
            initialColor={color} />
      );
    });

    return nodes.concat(links);
  }

  loadGraph(graphContext, parentWorkflow) {
    let { workflowOperator } = graphContext;

    this.meta.nodes = {};
    this.meta.links = [];

    this.tasks.forEach((task, i) => {
      let definition = workflowOperator.getTaskDefinitionFromTask(task),
          isNestedWorkflow =
            definition &&
            definition.implementsTask &&
            definition.implementsTask === 'Task.Base.Graph.Run';

      let node = {
        id: GCNode.id(),
        x: 0,
        y: 0,
        bounds: null,
        definition: definition || null,
        task,
        template: this.template.tasks[i],
        workflow: null
      };

      if (isNestedWorkflow) {
        let workflowName = definition.options.graphName,
            workflow = workflowOperator.getWorkflowTemplate(workflowName);

        workflow.loadGraph(graphContext, this);
        node.workflow = workflow;
      }

      this.meta.nodes[task.label] = node;
    });

    this.tasks.forEach(task => {
      let source = this.meta.nodes[task.label];

      if (task.waitOn) {
        Object.keys(task.waitOn).forEach(label => {
          let target = this.meta.nodes[label],
              waitOn = task.waitOn[label];

          this.meta.links.push({
            id: GCLink.id(),
            name: 'waitOn',
            source,
            target,
            waitOn
          });
        });
      }
    });

    this.layoutGraph(graphContext, parentWorkflow || this);
    this.calculateGraphBounds(parentWorkflow);
  }

  layoutGraph(graphContext, parentWorkflow) {
    let columns = [
      this.tasks
        .filter(task => !task.waitOn)
        .map((task, i) => {
          let node = this.meta.nodes[task.label];
          node.y = i;
          return node;
        })
    ];

    this.meta.columns = columns;

    let findMaxDepth = (task, depth = 0) => {
      if (!task.waitOn) { return depth; }

      let depths = Object.keys(task.waitOn).map(taskLabel => {
        let node = this.meta.nodes[taskLabel];

        return node ? findMaxDepth(node.task, depth + 1) : depth;
      });

      return Math.max(depth, ...depths);
    };

    this.tasks.filter(task => task.waitOn).forEach(task => {
      let column = findMaxDepth(task),
          node = this.meta.nodes[task.label];

      columns[column] = columns[column] || [];

      node.x = column;
      node.y = columns[column].length;

      columns[column].push(node);

      if (node.workflow) {
        this.layoutGraph(graphContext, node.workflow);
      }
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

    this.meta.rows = numRows;
    this.meta.cols = numCols;
  }

  calculateGraphBounds(parentWorkflow) {
    let letterSizeX = 14,
        minTaskSizeX = 140,
        minTaskSizeY = 70,
        taskGutter = 30;

    Object.keys(this.meta.nodes).map(label => {
      let node = this.meta.nodes[label];

      if (node.workflow) {
        node.workflow.calculateGraphBounds(this);
      }

      let nestedWorkflowBounds =
        node.workflow &&
        node.workflow.meta.bounds;

      if (nestedWorkflowBounds) {
        node.bounds = nestedWorkflowBounds.clone();
        // console.log(node.bounds.toArray());
        node.bounds.right = node.bounds.right + (taskGutter * 4) + minTaskSizeX;
        node.bounds.bottom = node.bounds.bottom + (taskGutter * 2) + minTaskSizeY;
        // console.log(node.bounds.toArray());
      }

      else {
        node.bounds =
          new Rectangle(0, 0,
            Math.max(minTaskSizeX, (label.length * letterSizeX + taskGutter)),
            minTaskSizeY
          );
      }
    });

    let colWidths = [],
        rowHeights = [];
    (() => {
      let buffer = null,
          columns = this.meta.columns,
          cols = this.meta.cols,
          rows = this.meta.rows;
      (() => {
        for (let row = 0; row < rows; row += 1) {
          buffer = [minTaskSizeY];
          for (let i = 0; i < cols; i += 1) {
            let node = columns[i][row];
            buffer.push(node && node.bounds && node.bounds.height || 0);
          }
          rowHeights[row] = Math.max(...buffer);
        }
      })();
      (() => {
        for (let col = 0; col < cols; col += 1) {
          buffer = [minTaskSizeX];
          for (let i = 0; i < rows; i += 1) {
            let node = columns[col][i];
            buffer.push(node && node.bounds && node.bounds.width || 0);
          }
          colWidths[col] = Math.max(...buffer);
        }
      })();
    })();

    let getTaskBounds = (col, row) => {
      let bottom = 0,
          left = 0,
          right = 0,
          top = 0;

      for (let y = 0; y <= row; y += 1) {
        if (y !== row) {
          top += taskGutter + rowHeights[y];
        }
        else {
          bottom = top + rowHeights[y];
          for (let x = 0; x <= col; x += 1) {
            if (x !== col) {
              left += taskGutter + colWidths[x];
            }
            else {
              right = left + colWidths[x];
            }
          }
        }
      }

      return new Rectangle(left, top, right, bottom);
    };

    Object.keys(this.meta.nodes).map(label => {
      let node = this.meta.nodes[label];
      node.bounds = getTaskBounds(node.x, node.y);
    });

    let getWorkflowBounds = () => {
      return new Rectangle(0, 0,
        taskGutter + colWidths.reduce((prev, curr) => prev + curr, 0),
        taskGutter + rowHeights.reduce((prev, curr) => prev + curr, 0)
      );
    };

    this.meta.bounds = getWorkflowBounds();

    let offsetVector = parentWorkflow ? [
      // 0, 60
      20, 80
    ] : [
      1500 - this.meta.bounds.width / 2,
      1500 - this.meta.bounds.height / 2
    ];

    // console.log(this, parentWorkflow, offsetVector);

    this.meta.bounds = this.meta.bounds.translate(offsetVector);

    Object.keys(this.meta.nodes).map(label => {
      let node = this.meta.nodes[label];
      node.bounds = node.bounds.translate(offsetVector);
    });
  }

}
