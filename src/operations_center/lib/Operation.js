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

export default class Operation {

  constructor(instance, operationsCenter) {
    this.operationsCenter = operationsCenter;
    instance = instance || {};
    this.meta = {
      bounds: null,
      cols: null,
      columns: null,
      groupId: null,
      height: null,
      isSubGraph: null,
      links: null,
      nodes: {
        byId: {},
        byLabel: {}
      },
      rows: null,
      width: null
    };
    this.instance = instance;
    this.definition = instance.definition;
  }

  renderGraph(parentWorkflow) {
    if (!parentWorkflow) {
      this.loadGraph(null);
    }

    let nodes = Object.keys(this.meta.nodes.byLabel).map(label => {
      let node = this.meta.nodes.byLabel[label];

      let orderPortId = GCPort.id(),
          waitingOnId = GCSocket.id(),
          failedId = GCSocket.id(),
          succeededId = GCSocket.id(),
          finishedId = GCSocket.id();

      node.orderPortId = orderPortId;
      node.orderSocketIds = {
        waitingOn: waitingOnId,
        failed: failedId,
        succeeded: succeededId,
        finished: finishedId
      };

      let leftSockets = [
        <GCSocket key={waitingOnId}
          dir={[-1, 0]}
          initialColor="#6cf"
          initialId={waitingOnId}
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

      let color = ({
        failed: 'yellow',
        succeeded: 'green',
        finished: '#6cf'
      })[node.instance.state] || '#999';

      if (node.instance.state === 'failed' && node.instance.error) {
        color = 'red';
      }

      return (
        <GCNode key={node.id}
            initialBounds={node.bounds}
            initialColor={color}
            initialId={node.id}
            initialName={node.task.label}
            isRemovable={false}
            isChangable={false}
            leftSockets={leftSockets}
            rightSockets={rightSockets}>
          {/*{node.workflow && node.workflow.renderGraph(this)}*/}
          {node.instance.error &&
            <pre style={{float: 'left', width: '80%', overflow: 'auto', height: 200, background: 'white', color: 'red'}}>
              {node.instance.error}
            </pre>
          }
        </GCNode>
      );
    });

    let links = this.meta.links.map(link => {
      let { source, target } = link;

      if (!source || !target) { return null; }

      let color = ({failed: 'red', succeeded: 'green', finished: '#6cf'})[link.waitingOn];

      return (
        <GCLink key={link.id}
            from={link.source.orderSocketIds.waitingOn}
            to={link.target.orderSocketIds[link.waitingOn]}
            dashed={true}
            initialId={link.id}
            initialColor={color} />
      );
    });

    return nodes.concat(links);
  }

  loadGraph(parentWorkflow) {
    this.meta.nodes = {byId: {}, byLabel: {}};
    this.meta.links = [];

    if (!this.definition || typeof this.definition !== 'object') {
      return;
    }
    if (!this.instance.tasks) {
      return;
    }

    let taskHash = {};

    this.definition.tasks.forEach((task, i) => {
      let definition = this.definition[task.label];

      taskHash[task.label] = {
        task,
        definition,
        i
      };
    });

    Object.keys(this.instance.tasks).forEach(instanceId => {
      let instance = this.instance.tasks[instanceId];

      let {task, definition, i} = taskHash[instance.label];

      let node = {
        id: instance.instanceId,
        x: 0,
        y: 0,
        bounds: null,
        instance,
        definition,
        task,
        workflow: null
      };

      // if (isNestedWorkflow) {
      //   let workflowName = definition.options.graphName,
      //       workflow = this.operationsCenter.getWorkflowTemplate(workflowName);
      //
      //   workflow.loadGraph(this);
      //   node.workflow = workflow;
      // }

      this.meta.nodes.byId[instance.instanceId] = node;
      this.meta.nodes.byLabel[instance.label] = node;
    });

    this.definition.tasks
      .map(task => this.meta.nodes.byLabel[task.label])
      .filter(node => node.instance.waitingOn)
      .forEach(node => {
        Object.keys(node.instance.waitingOn).forEach(instanceId => {
          let target = this.meta.nodes.byId[instanceId],
              waitingOn = node.instance.waitingOn[instanceId];

          this.meta.links.push({
            id: node.instance.label + ':>' + target.instance.label,
            name: 'waitingOn',
            source: node,
            target,
            waitingOn
          });
        });
      });

    this.layoutGraph(parentWorkflow || this);
    this.calculateGraphBounds(parentWorkflow);
  }

  layoutGraph(parentWorkflow) {
    let columns = [
      this.definition.tasks
        .map(instance => this.meta.nodes.byLabel[instance.label])
        .filter(node => !node.instance.waitingOn)
        .map((node, i) => {
          node.y = i;
          return node;
        })
    ];

    this.meta.columns = columns;

    let findMaxDepth = (instance, depth = 0) => {
      if (!instance.waitingOn) { return depth; }

      let depths = Object.keys(instance.waitingOn).map(instanceId => {
        let node = this.meta.nodes.byId[instanceId];

        return node ? findMaxDepth(node.instance, depth + 1) : depth;
      });

      return Math.max(depth, ...depths);
    };

    this.definition.tasks
      .map(instance => this.meta.nodes.byLabel[instance.label])
      .filter(node => node.instance.waitingOn)
      .forEach(node => {
        // debugger;
        let column = findMaxDepth(node.instance);

        columns[column] = columns[column] || [];

        node.x = column;
        node.y = columns[column].length;

        columns[column].push(node);

        // if (node.workflow) {
        //   this.layoutGraph(graphContext, node.workflow);
        // }
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

    Object.keys(this.meta.nodes.byLabel).map(label => {
      let node = this.meta.nodes.byLabel[label];

      // if (node.workflow) {
      //   node.workflow.calculateGraphBounds(this);
      // }

      // let nestedWorkflowBounds =
      //   node.workflow &&
      //   node.workflow.meta.bounds;

      // if (nestedWorkflowBounds) {
      //   node.bounds = nestedWorkflowBounds.clone();
      //   // console.log(node.bounds.toArray());
      //   node.bounds.right = node.bounds.right + (taskGutter * 4) + minTaskSizeX;
      //   node.bounds.bottom = node.bounds.bottom + (taskGutter * 2) + minTaskSizeY;
      //   // console.log(node.bounds.toArray());
      // }

      if (node.instance.error) {
        node.bounds = new Rectangle(0, 0, 300, 300);
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

    Object.keys(this.meta.nodes.byLabel).forEach(label => {
      let node = this.meta.nodes.byLabel[label];
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

    Object.keys(this.meta.nodes.byLabel).forEach(label => {
      let node = this.meta.nodes.byLabel[label];
      node.bounds = node.bounds.translate(offsetVector);
    });
  }

}
