'use strict';

// import GraphNode from 'graph-canvas-web-ui/lib/Graph/Node';
import merge from 'lodash/object/merge';

export default class Task {

  constructor(data) { merge(this, data); }

  insertGraphNode(editor, label, bounds) {
    var taskInstance = {
      label: label,
      ignoreFailure: false,
      taskName: this.injectableName,
      taskDefinition: this
    };
    let node = editor.graph.add({
      graph: editor.graph,
      data: {
        task: taskInstance
      },
      bounds: bounds,
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
    taskInstance._node = node;
    return taskInstance;
  }

}
