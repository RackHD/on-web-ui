'use strict';

import LogsMessenger from '../messengers/LogsMessenger';
import EventsMessenger from '../messengers/EventsMessenger';

export default class Node {
  constructor(nodeId, handler) {
    this.nodeId = nodeId;
    this.logs = new LogsMessenger();
    // window.localStorage.setItem('logs-' + this.nodeId, []);
    if (handler) { this.connect(handler); }
    return this;
  }

  listen(handler) {
    this.logs.listen(msg => {
      if (msg.data.subject !== this.nodeId) return;
      let history = JSON.parse(window.localStorage.getItem('logs-' + this.nodeId)) || [];
      history.push(msg);
      window.localStorage.setItem('logs-' + this.nodeId, JSON.stringify(history));
      handler(msg);
    });
  }

  ignore() {
    this.logs.ignore();
  }

  connect(handler) {
    let history = [];
    try {
      history = JSON.parse(window.localStorage.getItem('logs-' + this.nodeId)) || [];
    } catch (err) {
      window.localStorage.setItem('logs-' + this.nodeId, '[]');
    }
    history.forEach(handler);
    this.listen(handler);
    this.logs.connect();
  }

  disconnect() {
    this.ignore();
    this.logs.disconnect();
  }
}
