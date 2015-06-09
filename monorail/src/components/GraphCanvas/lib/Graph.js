'use strict';

import Rectangle from './Rectangle';
import Link from './Graph/Link';
import Node from './Graph/Node';

export default class Graph {

  constructor(bounds) {
    this.cache = {
      nodes: {},
      ports: {},
      sockets: {},
      links: {},
      index: {}
    };
    this.bounds = new Rectangle(bounds);
  }

  // JSON input/output

  static fromJSON(json) {
    var graph = new Graph();
    if (typeof json === 'string') { json = JSON.parse(json); }
    graph.json = json;
    return graph;
  }

  toJSON() { return JSON.stringify(this.json); }

  set json(object) {
    if (!object || typeof object !== 'object') {
      throw new Error('Graph: json getter requires an object, not a string.');
    }
    this.bounds = new Rectangle(object.bounds);
    var cache = object.cache;
    this.cache.nodes = {};
    cache.nodes.forEach(node => Node.fromJSON(node, {graph: this}));
    this.cache.links = {};
    cache.links.forEach(link => Link.fromJSON(link, {graph: this}));
  }

  get json() {
    return {
      cache: {
        nodes: this.nodes.map(node => node.json),
        links: this.links.map(link => link.json)
      },
      bounds: this.bounds.toArray()
    };
  }

  // Cache collections

  get nodes() {
    return Object.keys(this.cache.nodes).map(this.node.bind(this));
  }

  get ports() {
    return Object.keys(this.cache.ports).map(this.port.bind(this));
  }

  get sockets() {
    return Object.keys(this.cache.sockets).map(this.socket.bind(this));
  }

  get links() {
    return Object.keys(this.cache.links).map(this.link.bind(this));
  }

  // Graph interface

  add(node) {
    if (node) {
      node = Object.create(node);
      node.graph = this;
    }
    node = new Node(node || {graph: this});
    node.cache(this);
    this.cache.index = this.cache.index || {};
    this.cache.index.links = this.cache.index.links || {};
    this.cache.index.links[node.id] = this.cache.index.links[node.id] || {};
    return node;
  }

  remove(node) {
    if (!(node instanceof Node)) {
      throw new Error('Graph: unable to remove invalid node object.');
    }
    node.uncache(this);
  }

  connect(link) {
    if (!link) {
      throw new Error('Graph: invalid link.');
    }
    link = Object.create(link);
    link.graph = this;
    link = new Link(link);
    link.cache(this);
    if (link.socketOut && link.socketIn) {
      this.cache.index = this.cache.index || {};
      var linksIndex =
        this.cache.index.links = this.cache.index.links || {};

      var socketOut = link.socketOut.id,
          socketIn = link.socketIn.id;

      linksIndex[socketOut] = linksIndex[socketOut] || {};
      linksIndex[socketOut][socketIn] = linksIndex[socketOut][socketIn] || {};
      linksIndex[socketOut][socketIn][link.id] = link;

      linksIndex[socketIn] = linksIndex[socketIn] || {};
      linksIndex[socketIn][socketOut] = linksIndex[socketIn][socketOut] || {};
      linksIndex[socketIn][socketOut][link.id] = link;

      var portOut = link.socketOut.port.id,
          portIn = link.socketIn.port.id;

      linksIndex[portOut] = linksIndex[portOut] || {};
      linksIndex[portOut][portIn] = linksIndex[portOut][portIn] || {};
      linksIndex[portOut][portIn][link.id] = link;

      linksIndex[portIn] = linksIndex[portIn] || {};
      linksIndex[portIn][portOut] = linksIndex[portIn][portOut] || {};
      linksIndex[portIn][portOut][link.id] = link;

      var nodeOut = link.socketOut.port.node.id,
          nodeIn = link.socketIn.port.node.id;

      linksIndex[nodeOut] = linksIndex[nodeOut] || {};
      linksIndex[nodeOut][nodeIn] = linksIndex[nodeOut][nodeIn] || {};
      linksIndex[nodeOut][nodeIn][link.id] = link;

      linksIndex[nodeIn] = linksIndex[nodeIn] || {};
      linksIndex[nodeIn][nodeOut] = linksIndex[nodeIn][nodeOut] || {};
      linksIndex[nodeIn][nodeOut][link.id] = link;
    }
    return link;
  }

  disconnect(link) {
    if (!(Link instanceof Link)) {
      throw new Error('Graph: unable to remove invalid link object.');
    }
    link.uncache(this);
    if (link.socketOut && link.socketIn) {
      this.cache.index = this.cache.index || {};
      var linksIndex =
        this.cache.index.links = this.cache.index.links || {};

      var socketOut = link.socketOut.id,
          socketIn = link.socketIn.id;

      linksIndex[socketOut] = linksIndex[socketOut] || {};
      linksIndex[socketOut][socketIn] = linksIndex[socketOut][socketIn] || {};
      delete linksIndex[socketOut][socketIn][link.id];

      linksIndex[socketIn] = linksIndex[socketIn] || {};
      linksIndex[socketIn][socketOut] = linksIndex[socketIn][socketOut] || {};
      delete linksIndex[socketIn][socketOut][link.id];

      var portOut = link.socketOut.port.id,
          portIn = link.socketIn.port.id;

      linksIndex[portOut] = linksIndex[portOut] || {};
      linksIndex[portOut][portIn] = linksIndex[portOut][portIn] || {};
      delete linksIndex[portOut][portIn][link.id];

      linksIndex[portIn] = linksIndex[portIn] || {};
      linksIndex[portIn][portOut] = linksIndex[portIn][portOut] || {};
      delete linksIndex[portIn][portOut][link.id];

      var nodeOut = link.socketOut.port.node.id,
          nodeIn = link.socketIn.port.node.id;

      linksIndex[nodeOut] = linksIndex[nodeOut] || {};
      linksIndex[nodeOut][nodeIn] = linksIndex[nodeOut][nodeIn] || {};
      delete linksIndex[nodeOut][nodeIn][link.id];

      linksIndex[nodeIn] = linksIndex[nodeIn] || {};
      linksIndex[nodeIn][nodeOut] = linksIndex[nodeIn][nodeOut] || {};
      delete linksIndex[nodeIn][nodeOut][link.id];
    }
  }

  // Cache management

  isDef(def) {
    return typeof def === 'undefined' || typeof def === 'number';
  }

  entity(name, id, def) {
    if (this.isDef(def)) { return this.cache[name][id]; }
    this.cache[name][id] = def;
    return def;
  }

  node(id, def) {
    return this.entity('nodes', id, def);
  }

  port(id, def) {
    return this.entity('ports', id, def);
  }

  socket(id, def) {
    return this.entity('sockets', id, def);
  }

  link(id, def) {
    return this.entity('links', id, def);
  }

}
