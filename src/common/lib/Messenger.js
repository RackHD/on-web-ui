// Copyright 2015, EMC, Inc.

import { EventEmitter } from 'events';

export default class Messenger extends EventEmitter {
  channel = null;
  connection = null;
  handlers = null;
  host = null;
  id = null;
  isConnected = false;
  isOpen = false;
  reconnectInterval = 1000 * 30;
  secure = false;
  url = null;

  constructor(channel, host, secure) {
    super();
    this.channel = channel || this.channel;
    this.host = host || this.host ||
      (window && window.location.host) || '127.0.0.1';
    this.secure = secure || this.secure;
    this.url = 'ws';
    if (this.secure || window.location.protocol === 'https:') this.url += 's';
    this.url += '://' + this.host;
    if (this.url.charAt(this.url.length - 1) !== '/') this.url += '/';
    if (this.channel) this.url += this.channel;
  }

  connect(cb) {
    if (this.isConnected) { return; }
    this.isConnected = true;

    this.removeAllListeners();

    try {
      this.connection = new WebSocket(this.url);
    } catch (err) {
      console.error(err);
    }

    if (this.handlers) {
      this.handlers.forEach(name => this.on(name, this[name].bind(this)));
    }

    this.once('session', (msg) => {
      this.id = msg.id;
      if (cb) cb(msg);
    });

    this.connection.onopen = (event) => {
      this.isOpen = true;
      this.emit('open', event);
      this.connection.send('{"handler": "init"}');
    };

    this.connection.onclose = (event) => {
      this.isConnected = this.isOpen = false;
      this.emit('close', event);

      setTimeout(this.connect.bind(this, cb), this.reconnectInterval);
    };

    this.connection.onerror = (event) => {
      this.isConnected = this.isOpen = false;
      try {
        this.emit('error', event);
      } catch (err) {
        console.error(err, event);
      }

      setTimeout(this.connect.bind(this, cb), this.reconnectInterval);
    };

    this.connection.onmessage = (event) => {
      let msg = JSON.parse(event.data);
      this.emit('message', msg, event);
      if (msg && msg.handler) this.emit(msg.handler, msg, event);
    };
  }

  disconnect() {
    this.connection.close();
    this.isConnected = this.isOpen = false;
  }

  ready(cb) {
    this.isOpen ? cb() : this.once('open', cb);
  }

  session(cb) {
    this.id ? cb() : this.once('session', cb);
  }

  exec(handler, params, resource) {
    let payload = JSON.stringify({handler, resource, params});
    this.ready(() => {
      this.connection.send(payload);
    });
  }

  query(params, resource) {
    this.exec('query', params, resource);
  }

  all(params, resource) {
    this.exec('all', params, resource);
  }

  get(params, resource) {
    this.exec('get', params, resource);
  }

  watch(params, resource) {
    this.exec('watch', params, resource);
  }

  stop(params, resource) {
    this.exec('stop', params, resource);
  }
}
