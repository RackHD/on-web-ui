// Copyright 2015, EMC, Inc.

'use strict';

import { EventEmitter } from 'events';

export default {
  // events: null,
  // wsConn: null,
  reconnectInterval: 1000 * 30,

  connect(cb, setup) {
    if (this.isConnected) { return; }
    this.isConnected = true;

    this.events = new EventEmitter();
    // this.wsConn = new WebSocket('ws://localhost:8888');
    this.wsConn = new WebSocket('ws://' + window.location.hostname + ':8888');

    if (setup) setup();

    this.events.once('init', (msg) => {
      this.initMsg = msg;
      this.id = msg.id;
      if (cb) cb(msg);
    });

    this.wsConn.onopen = (event) => {
      this.isOpen = true;
      this.events.emit('open', event);
    };

    this.wsConn.onclose = (event) => {
      this.isConnected = this.isOpen = false;
      this.events.emit('close', event);
      setTimeout(this.connect.bind(this, cb, setup), this.reconnectInterval);
    };

    this.wsConn.onerror = (event) => {
      this.isConnected = this.isOpen = false;
      this.events.emit('error', event);
      setTimeout(this.connect.bind(this, cb, setup), this.reconnectInterval);
    }

    this.wsConn.onmessage = (event) => {
      var msg = JSON.parse(event.data);
      this.events.emit('message', msg, event);
      if (msg && msg.type) this.events.emit(msg.type, msg, event);
    };
  },

  disconnect() {
    this.wsConn.close();
    this.isConnected = this.isOpen = false;
  },

  ready(cb) {
    this.isOpen ? cb() : this.events.once('open', cb);
  },

  init(cb, setup) {
    var shouldConnect = !this.isConnected;
    if (shouldConnect) {
      this.connect(cb, () => {
        if (setup) setup();
        this.ready(() => this.wsConn.send('{"type": "init"}'));
      });
      return;
    }
    this.initMsg ? cb(this.initMsg) : this.events.once('init', cb);
  },

  list(collection) {
    this.wsConn.send('{"type": "list", "collection": "' + collection + '"}');
  },

  set(collection, position, size, params) {
    this.init((msg) => {
      let type = 'set',
          id = this.id || msg.id;
      this.wsConn.send(JSON.stringify({type, collection, id, item: {id, position, size, params}}));
    });
  },

  pan(offset) {
    let type = 'pan';
    this.wsConn.send(JSON.stringify({type, offset}))
  },

  move(collection, id, offset) {
    let type = 'move';
    this.wsConn.send(JSON.stringify({type, collection, id, offset}))
  }
}
