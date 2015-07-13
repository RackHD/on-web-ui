'use strict';

import Rectangle from '../Rectangle';
import newId from './newId';
import Node from './Node';

const idPrefixCode = 'G'.charCodeAt(0);

export default class Group {

  constructor({ id, data, graph, nodes, bounds, layer, scale }) {
    this.id = newId(id || idPrefixCode);
    this.data = data;
    this.graph = graph;
    this.bounds = new Rectangle(bounds);
    this.layer = layer || 0;
    this.scale = scale || 1;
    this.nodes = nodes;
  }

  static fromJSON(json, { graph }) {
    var node = new Node({ graph });
    if (typeof json === 'string') { json = JSON.parse(json); }
    node.json = json;
    return node;
  }

  toJSON() { return JSON.stringify(this.json); }

  set json(object) {
    if (!object || typeof object !== 'object') {
      throw new Error('Node: json getter requires an object, not a string.');
    }
    this.id = newId(object.id || this.id);
    this.data = object.data || this.data;
    this.bounds = new Rectangle(object.bounds);
    this.layer = object.layer || this.layer;
    this.scale = object.scale || this.scale;
    if (!this.graph) {
      throw new Error('Node: cannot de-serialize json object without graph reference.');
    }
    if (object.ports) {
      this.nodes = object.nodes;
    }
    this.cache();
    this.graph.add(this);
  }

  get json() {
    var nodes = [];
    this.forEachNode(
      node => nodes.push(Node.fromJSON(node, {
        graph: this.graph,
        group: this
      }))
    );
    return {
      id: this.id,
      data: this.data,
      bounds: this.bounds.toArray(),
      layer: this.layer,
      scale: this.scale,
      nodes
    };
  }

  get nodes() { return this._nodes; }

  set nodes(nodes) {
    this._nodes = {};
    if (!nodes) { return; }
    if (!Array.isArray(nodes)) {
      if (typeof nodes !== 'object') { return; }
      nodes = Object.keys(nodes).map(nodeId => nodes[nodeId]);
    }
    nodes.forEach(node => {
      node = new Node({
        id: node.id,
        graph: node.graph,
        group: this,
        name: node.name,
        ports: node.ports
      });
      this._nodes[node.id] = this.graph.node(node.id, node);
    });
  }

  forEachNode(iterator) {
    if (!this.ports) { return; }
    Object.keys(this.nodes).forEach(nodeId => {
      var node = this.nodes[nodeId];
      iterator.call(this, node, nodeId, this.nodes);
    });
  }

  get graph() { return this._graph; }

  set graph(graph) {
    if (!graph) { return; }
    if (this._graph && this._graph !== graph) {
      throw new Error('Node: graph reference mismatch.');
    }
    this._graph = graph;
  }

  cache(graph) {
    if (graph) { this.graph = graph; }
    this.graph.group(this.id, this);
    this.forEachNode(node => node.cache(graph));
  }

  uncache(graph) {
    if (graph) { this.graph = graph; }
    this.graph.node(this.id, null);
    this.forEachNode(node => node.uncache(graph));
  }

  remove(graph) {
    if (graph) { this.graph = graph; }
    this.graph.remove(this);
    this.nodes.forEach(node => node.remove(graph));
  }

}
