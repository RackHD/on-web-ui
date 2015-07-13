'use strict';

import merge from 'lodash/object/merge';

export default class Workflow {

  constructor(data) { merge(this, data); }

  insertGraphNode(editor, label, bounds) {
    var workflowInstance = {
      label: label,
      ignoreFailure: false,
      taskName: this.injectableName,
      taskDefinition: this
    };
    let node = editor.graph.add({
      graph: editor.graph,
      data: {
        task: workflowInstance
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
        }
      ]
    });
    workflowInstance._node = node;
    return workflowInstance;
  }

}
