// Copyright 2015, EMC, Inc.

import EventsMessenger from 'src-common/messengers/EventsMessenger';
import LogsMessenger from 'src-common/messengers/LogsMessenger';

export default class NodeMonitor {

  constructor(nodeId, handler) {
    this.nodeId = nodeId;

    this.logs = new LogsMessenger();

    if (handler) { this.connect(handler); }
    return this;
  }

  listen(handler) {
    this.logs.listen(msg => {
      if (msg.data.subject !== this.nodeId) return;

      handler(msg);
    });
  }

  ignore() {
    this.logs.ignore();
  }

  connect(handler) {
    this.listen(handler);
    this.logs.connect();
  }

  disconnect() {
    this.ignore();
    this.logs.disconnect();
  }

}
