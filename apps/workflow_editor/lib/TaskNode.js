'use strict';

export default class TaskNode {

  constructor(editor, taskDefinition, { label, ignoreFailure }) {
    this.editor = editor;
    this.taskDefinition = taskDefinition;
    this.node = null;

    this.instance = {
      _node: null,
      label,
      ignoreFailure,
      taskName: taskDefinition.injectableName,
      taskDefinition
    };
  }

  get gcPorts() {
    return [
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
    ];
  }

  addGraphCanvasNode(bounds) {
    this.node = this.editor.graph.add({
      graph: this.editor.graph,
      data: {task: this.instance},
      bounds: bounds,
      layer: 1,
      scale: 1,
      ports: this.gcPorts
    });
    this.instance._node = this.node;
  }

}
