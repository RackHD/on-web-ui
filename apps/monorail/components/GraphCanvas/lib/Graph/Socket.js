'use strict';

import newId from './newId';
import Vector from '../Vector';

const idPrefixCode = 'S'.charCodeAt(0);

export default class Socket {

  constructor({ id, graph, type, port, dir }) {
    this.id = newId(id || idPrefixCode);
    this.graph = graph || null;
    this.type = type || null;
    this.port = port || null;
    this.dir = new Vector(dir || [1, 0]);
  }

  static fromJSON(json, { graph }) {
    var node = new Socket({ graph });
    if (typeof json === 'string') { json = JSON.parse(json); }
    node.json = json;
    return node;
  }

  toJSON() { return JSON.stringify(this.json); }

  set json(object) {
    if (!object || typeof object !== 'object') {
      throw new Error('Socket: json getter requires an object, not a string.');
    }
    this.id = newId(object.id || this.id);
    this.type = object.type || this.type;
    this.dir = new Vector(object.dir || this.dir);
    if (!this.graph) {
      throw new Error('Socket: cannot to de-serialize json object without graph reference.');
    }
    this.port = this.graph.port(object.port) || this.port;
    this.cache();
  }

  get json() {
    return {
      id: this.id,
      type: this.type,
      port: this.port && this.port.id,
      dir: this.dir && this.dir.toArray()
    };
  }

  get links() {
    var subindex = this.graph.getIndex('links')[this.id],
        links = {};
    Object.keys(subindex || {}).forEach(otherEnd => {
      otherEnd = subindex[otherEnd];
      Object.keys(otherEnd || {}).forEach(linkId => {
        links[linkId] = otherEnd[linkId];
      });
    });
    return Object.keys(links).map(linkId => links[linkId]);
  }

  get node() {
    return this.port && this.port.node;
  }

  get graph() { return this._graph; }

  set graph(graph) {
    if (!graph) { return; }
    if (this._graph && this._graph !== graph) {
      throw new Error('Socket: graph reference mismatch.');
    }
    this._graph = graph;
  }

  cache(graph) {
    if (graph) { this.graph = graph; }
    this.graph.socket(this.id, this);
  }

  uncache(graph) {
    if (graph) { this.graph = graph; }
    this.graph.socket(this.id, null);
  }

}
