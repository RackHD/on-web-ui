'use strict';

// import GraphNode from 'common-web-ui/lib/Graph/Node';

export default class Task {

  constructor(data) {
    Object.keys(data).forEach(prop => this[prop] = data[prop]);
  }

  insertGraphNode(editor, label, bounds) {
    var taskInstance = {
      label: label,
      ignoreFailure: false,
      taskName: this.injectableName,
      taskDefinition: this
    };
    let node = editor.graph.add({
      graph: editor.graph,
      data: {task: taskInstance},
      bounds: bounds,
      layer: 1,
      scale: 1,
      ports: [
        {name: 'Flow', sockets: [
          {type: 'Signal', dir: [-1, 0]},
          {type: 'Failure', dir: [1, 0]},
          {type: 'Success', dir: [1, 0]},
          {type: 'Complete', dir: [1, 0]}
        ]}
      ]
    });
    taskInstance._node = node;
    return taskInstance;
  }

}
