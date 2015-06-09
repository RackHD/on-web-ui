'use strict';

import Rectangle from '../Rectangle';
import newId from './newId';
import Port from './Port';

const idPrefixCode = 'N'.charCodeAt(0);

export default class Node {

  constructor({ id, graph, ports, bounds, layer, scale }) {
    this.id = newId(id || idPrefixCode);
    this.data = null;
    this.graph = graph;
    this.bounds = new Rectangle(bounds);
    this.layer = layer;
    this.scale = scale;
    this.ports = ports;
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
      this.ports = object.ports;
    }
    this.graph.node(this.id, this);
    this.graph.add(this);
  }

  get json() {
    var ports = [];
    this.forEachPort(
      port => ports.push(Port.fromJSON(port, {graph: this.graph}))
    );
    return {
      id: this.id,
      data: this.data,
      bounds: this.bounds.toArray(),
      layer: this.layer,
      scale: this.scale,
      ports
    };
  }

  get ports() { return this._ports; }

  set ports(ports) {
    this._ports = {};
    if (!ports) { return; }
    if (!Array.isArray(ports)) {
      if (typeof ports !== 'object') { return; }
      ports = Object.keys(ports).map(portName => ports[portName]);
    }
    ports.forEach(port => {
      port = new Port({
        id: port.id,
        graph: this.graph,
        node: this,
        name: port.name,
        sockets: port.sockets
      });
      this._ports[port.name] = this.graph.port(port.id, port);
    });
  }

  forEachPort(iterator) {
    if (!this.ports) { return; }
    Object.keys(this.ports).forEach(portName => {
      var port = this.ports[portName];
      iterator.call(this, port, portName, this.ports);
    });
  }

  get links() {
    var subindex = this.graph.cache.index.links[this.id],
        links = {};
    Object.keys(subindex || {}).forEach(otherEnd => {
      otherEnd = subindex[otherEnd];
      Object.keys(otherEnd || {}).forEach(linkId => {
        links[linkId] = otherEnd[linkId];
      });
    });
    return Object.keys(links).map(linkId => links[linkId]);
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
    this.graph.node(this.id, this);
    this.forEachPort(port => port.cache(graph));
  }

  uncache(graph) {
    if (graph) { this.graph = graph; }
    this.graph.node(this.id, null);
    this.forEachPort(port => port.uncache(graph));
  }

  remove(graph) {
    if (graph) { this.graph = graph; }
    this.graph.remove(this);
    this.links.forEach(link => link.remove(graph));
  }

}
