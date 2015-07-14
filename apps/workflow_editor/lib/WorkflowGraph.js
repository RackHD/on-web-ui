'use strict';

export default class WorkflowGraph {

  constructor(editor, workflowTemplate, label) {
    workflowTemplate = workflowTemplate || {};

    this.editor = editor;
    this.node = null;
    this.workflowTemplate = workflowTemplate;

    this.instance = {
      _node: null,
      label: label,
      workflowTemplate: workflowTemplate
    };
  }

  get name() {
    return this.instance.label || this.workflowTemplate.friendlyName;
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
      }
    ];
  }

  addGraphCanvasNode(bounds) {
    this.node = this.editor.graph.add({
      graph: this.editor.graph,
      data: { task: this.instance },
      bounds: bounds,
      layer: 1,
      scale: 1,
      ports: this.gcPorts
    });
    this.instance._node = this.node;
  }

  addGraphCanvasGroup(bounds) {
    this.group = this.editor.graph.addGroup({

    });
  }

}
