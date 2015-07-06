'use strict';

import GraphNode from 'common-web-ui/lib/Graph/Node';

export default class Task {

  constructor(data, editor) {
    Object.keys(data).forEach(prop => this[prop] = data[prop]);
    this.editor = editor || this.editor;
  }

  toGraphNode(bounds, editor) {
    editor = editor || this.editor;
    return new GraphNode({
      graph: editor.graph,
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
  }

}
