'use strict';

import newId from './newId';

const idPrefixCode = 'L'.charCodeAt(0);

export default class Link {

  constructor({ id, graph, socketIn, socketOut, layer, scale }) {
    this.id = newId(id || idPrefixCode);
    this.data = null;
    this.graph = graph || null;
    this.socketIn = socketIn || null;
    this.socketOut = socketOut || null;
    this.layer = layer || 0;
    this.scale = scale || 1;
  }

  static fromJSON(json, { graph }) {
    var link = new Link({ graph });
    if (typeof json === 'string') { json = JSON.parse(json); }
    link.json = json;
    return link;
  }

  toJSON() { return JSON.stringify(this.json); }

  set json(object) {
    if (!object || typeof object !== 'object') {
      throw new Error('Link: json getter requires an object, not a string.');
    }
    this.id = newId(object.id || this.id);
    this.data = object.data | this.data;
    this.layer = object.layer || this.layer;
    this.scale = object.scale || this.scale;
    if (!this.graph) {
      throw new Error('Link: cannot de-serialize json object without graph reference.');
    }
    this.graph.link(this.id, this);
    if (object.socketOut && object.socketIn) {
      this.socketOut = this.graph.socket(object.socketOut);
      this.socketIn = this.graph.socket(object.socketIn);
      this.graph.connect(this);
    }
  }

  get json() {
    return {
      id: this.id,
      data: this.data,
      socketOut: this.socketOut && this.socketOut.id,
      socketIn: this.socketIn && this.socketIn.id,
      layer: this.layer,
      scale: this.scale
    };
  }

  get graph() { return this._graph; }

  set graph(graph) {
    if (!graph) { return; }
    if (this._graph && this._graph !== graph) {
      throw new Error('Link: graph reference mismatch.');
    }
    this._graph = graph;
  }

  cache(graph) {
    if (graph) { this.graph = graph; }
    this.graph.link(this.id, this);
  }

  uncache(graph) {
    if (graph) { this.graph = graph; }
    this.graph.link(this.id, null);
  }

  remove(graph) {
    if (graph) { this.graph = graph; }
    this.graph.disconnect(this);
  }

  // getBounds(socketOutElement, socketInElement) {}

}
