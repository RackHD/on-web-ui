'use strict';

import newId from './newId';
import Socket from './Socket';

const idPrefixCode = 'P'.charCodeAt(0);

export default class Port {

  constructor({ id, graph, node, name, sockets }) {
    this.id = newId(id || idPrefixCode);
    this.data = null;
    this.graph = graph || null;
    this.name = name || null;
    this.node = node || null;
    this.sockets = sockets;
  }

  static fromJSON(json, { graph }) {
    var node = new Port({ graph });
    if (typeof json === 'string') { json = JSON.parse(json); }
    node.json = json;
    return node;
  }

  toJSON() { return JSON.stringify(this.json); }

  set json(object) {
    if (!object || typeof object !== 'object') {
      throw new Error('Port: json getter requires an object, not a string.');
    }
    this.id = newId(object.id || this.id);
    this.name = object.name || this.name;
    if (!this.graph) {
      throw new Error('Port: cannot de-serialize json object without graph reference.');
    }
    this.node = this.graph.node(object.node) || this.node;
    if (object.sockets) {
      this.sockets = object.sockets;
    }
    this.cache();
  }

  get json() {
    var sockets = [];
    this.forEachSocket(
      socket => socket.push(Socket.fromJSON(socket, {
        graph: this.graph,
        port: this
      }))
    );
    return {
      id: this.id,
      name: this.name,
      node: this.node && this.node.id,
      sockets
    };
  }

  get sockets() { return this._sockets; }

  set sockets(sockets) {
    this._sockets = {};
    if (!sockets) { return; }
    if (!Array.isArray(sockets)) {
      if (typeof sockets !== 'object') { return; }
      sockets = Object.keys(sockets).map(socketType => sockets[socketType]);
    }
    sockets.forEach(socket => {
      socket = new Socket({
        id: socket.id,
        graph: this.graph,
        type: socket.type,
        port: this,
        dir: socket.dir
      });
      this._sockets[socket.type] =
        this.graph.socket(socket.id, socket);
    });
  }

  forEachSocket(iterator) {
    if (!this.sockets) { return; }
    Object.keys(this.sockets).forEach(socketType => {
      var socket = this.sockets[socketType];
      iterator.call(this, socket, socketType, this.sockets);
    });
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

  get graph() { return this._graph; }

  set graph(graph) {
    if (!graph) { return; }
    if (this._graph && this._graph !== graph) {
      throw new Error('Port: graph reference mismatch.');
    }
    this._graph = graph;
  }

  cache(graph) {
    if (graph) { this.graph = graph; }
    this.graph.port(this.id, this);
    this.forEachSocket(socket => socket.cache(graph));
  }

  uncache(graph) {
    if (graph) { this.graph = graph; }
    this.graph.port(this.id, null);
    this.forEachSocket(socket => socket.uncache(graph));
  }

}
