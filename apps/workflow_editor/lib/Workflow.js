// Copyright 2015, EMC, Inc.

'use strict';

import cloneDeep from 'lodash/lang/cloneDeep';
import merge from 'lodash/object/merge';

import {
    GCGroup,
    GCLink,
    GCNode,
    GCPort,
    GCSocket
  } from 'graph-canvas-web-ui/views/GraphCanvas';

import Rectangle from 'graph-canvas-web-ui/lib/Rectangle';

import ObjectDiff from './ObjectDiff';

export default class Workflow {

  constructor(template) {
    template = template || {};
    this.meta = {};
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
    }
    this.tasks = filter(this.tasks, nullTasks).sort(taskSort)
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

    let task = { label }

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
      this.renameWorkflow(panelView.state.name);
    }
  }

  renameWorkflow(newName) {
    this.template.friendlyName = newName;
    this.template.injectableName =
      this.injectableName || 'Graph.' + newName.replace(' ', '.');
    this.graphUpdate(graphContext);
  }

  // addWaitOnLink(graphContext, nodeA, nodeB) {
  //   // TODO:
  //   this.graphUpdate(graphContext);
  // }

  // removeWaitOnLink(graphContext, nodeA, nodeB) {
  //   // TODO:
  //   this.graphUpdate(graphContext);
  // }

  renderGraph(graphContext, parentWorkflow) {
    if (!parentWorkflow) {
      this.loadGraph(graphContext);
    }

    let taskGutter = 60,
        taskSizeX = 360,
        taskSizeY = 120,
        taskWidth = taskGutter + taskSizeX,
        taskHeight = taskGutter + taskSizeY,
        minSizeX = taskGutter + taskWidth / 2,
        minSizeY = taskGutter + taskHeight / 2,
        width = this.meta.cols * (taskSizeX + taskGutter) + taskGutter,
        height = this.meta.rows * (taskSizeY + taskGutter) + (taskGutter * 2),
        offsetX = 0,
        offsetY = 0;

    if (!parentWorkflow) {
      offsetX = 1500 - (width / 2);
      offsetY = 1500 - (height / 2);
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

      return (
        <GCNode key={node.id}
            initialBounds={[
              offsetX + taskGutter + (node.x * taskWidth), offsetY + taskGutter + (node.y * taskHeight),
              offsetX + taskWidth + (node.x * taskWidth), offsetY + taskHeight + (node.y * taskHeight)
            ]}
            initialColor="#999"
            initialId={node.id}
            initialName={node.task.label}
            onRemove={this.removeTask.bind(this, graphContext, node)}
            onChange={this.changeTask.bind(this, graphContext, node)}
            leftSocket={<GCSocket key={waitOnId}
                dir={[-1, 0]}
                initialColor="#6cf"
                initialId={waitOnId}
                initialName="Wait On"
                hideLabel={true} />}>
          <GCPort key={orderPortId}
              initialColor="#6cf"
              initialId={orderPortId}
              initialName="Run Order">
            <GCSocket key={failedId}
                dir={[1, 0]}
                initialColor="#6cf"
                initialId={failedId}
                initialName="Failed" />
            <GCSocket key={succeededId}
                dir={[1, 0]}
                initialColor="#6cf"
                initialId={succeededId}
                initialName="Succeeded" />
            <GCSocket key={finishedId}
                dir={[1, 0]}
                initialColor="#6cf"
                initialId={finishedId}
                initialName="Finished" />
          </GCPort>
        </GCNode>
      );
    });

    let links = Object.keys(this.meta.links).map(label => {
      let link = this.meta.links[label],
          { source, target } = link;

      if (!source || !target) { return null; }

      return (
        <GCLink key={link.id}
            from={link.source.orderSocketIds.waitOn}
            to={link.target.orderSocketIds[link.waitOn]}
            initialId={link.id}
            initialColor="#6cf" />
      );
    });

    if (!parentWorkflow) {
      return nodes.concat(links);
    }

    let workflowGroupId = GCGroup.id();
    this.meta.isSubGraph = !!parentWorkflow;
    this.meta.groupId = workflowGroupId;

    let workflowGroup = (
      <GCGroup key={workflowGroupId}
          initialBounds={parentWorkflow ? [
            0, 0, width, height
          ] : [
            1500 - width / 2, 1500 - height / 2,
            1500 + width / 2, 1500 + height / 2
          ]}
          initialColor="#bbb"
          initialName={this.friendlyName}
          initialId={workflowGroupId}
          isRemovable={false}
          onChange={this.changeWorkflow.bind(this, graphContext)} >
        {nodes.concat(links)}
      </GCGroup>
    );

    return workflowGroup;
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
        definition: definition || null,
        task: task,
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
          })
        });
      }
    })

    this.layoutGraph(graphContext, this);
    this.positionGraph();
  }

  layoutGraph(graphContext, parentWorkflow) {
    let columns = [
      this.tasks
        .filter(task => !task.waitOn)
        .map((task, i) => {
          let node = this.meta.nodes[task.label]
          node.y = i;
          return node;
        })
    ];

    this.meta.columns = columns;

    let findMaxDepth = (task, depth = 0) => {
      if (!task.waitOn) { return depth; }

      depth += 1;

      let depths = Object.keys(task.waitOn).map(taskLabel => {
        let node = this.meta.nodes[taskLabel];

        return node ? findMaxDepth(node.task, depth) : depth;
      });

      return Math.max.apply(Math, depths);
    }

    this.tasks.filter(task => task.waitOn).forEach(task => {
      let column = findMaxDepth(task),
          node = this.meta.nodes[task.label];

      columns[column] = columns[column] || [];

      node.x = column;
      node.y = columns[column].length;

      columns[column].push(node);
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

  positionGraph() {
    // TODO: adjust spacing and size for nested workflows
  }

}
