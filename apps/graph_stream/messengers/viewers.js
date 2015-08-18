'use strict';

import { EventEmitter } from 'events';

let events = new EventEmitter();

export let wsConn = new WebSocket('ws://localhost:8888');

wsConn.onopen = function (event) {
  console.log('open:', event);
  wsConn.isOpen = true;
  events.emit('open', event);
}

wsConn.onclose = function (event) {
  console.log('close', event);
  wsConn.isOpen = false;
  events.emit('close', event);
}

wsConn.onmessage = function (event) {
  console.log('message:', event);
  var msg = JSON.parse(event.data);
  events.emit('message', msg, event);
  if (msg && msg.type) {
    events.emit(msg.type, msg, event);
  }
}

events.on('init', function (msg) {
  console.log('init:', msg.id, msg.viewers);
  wsConn.initMsg = msg;
  wsConn.id = msg.id;
  wsConn.viewers = msg.viewers;
})

export default {
  events: events,
  wsConn: wsConn,

  ready(cb) { wsConn.isOpen ? cb() : this.events.once('open', cb); },
  init(cb) { wsConn.id ? cb(wsConn.initMsg) : this.events.once('init', cb); },

  // on() { return this.events.on.apply(this, arguments); },
  // once() { return this.events.once.apply(this, arguments); },
  // off() { return this.events.off.apply(this, arguments); },

  reg(position, size) {
    let type = 'reg', id = this.wsConn.id;
    this.wsConn.send(JSON.stringify({type, id, position, size}));
  },

  pan(offset) {
    let type = 'pan';
    this.wsConn.send(JSON.stringify({type, offset}))
  },

  move(id, offset) {
    let type = 'move';
    this.wsConn.send(JSON.stringify({type, id, offset}))
  }
}
