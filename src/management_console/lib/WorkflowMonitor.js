// Copyright 2015, EMC, Inc.

import LogsMessenger from 'src-common/messengers/LogsMessenger';
import EventsMessenger from 'src-common/messengers/EventsMessenger';

export default class WorkflowMonitor {
  constructor(workflow, handlers) {
    this.workflowNode = workflow.node;
    this.workflowId = workflow.instanceId;

    this.logs = new LogsMessenger();
    this.events = new EventsMessenger();

    if (handlers) { this.connect(handlers); }
    return this;
  }

  listen(handlers={}) {
    let {logs, events} = handlers;

    this.logs.listen(msg => {
      msg.data.subject === this.workflowNode && logs(msg);
    });

    this.events.listen(msg => {
      let pattern = msg.id.split('.');
      pattern[0] === 'graph' && pattern[2] === this.workflowId && events(msg, pattern);
    });
  }

  ignore() {
    this.logs.ignore();
    this.events.ignore();
  }

  connect(handlers) {
    this.listen(handlers);

    this.logs.connect();
    this.events.connect();
  }

  disconnect() {
    this.ignore();

    this.logs.disconnect();
    this.events.disconnect();
  }
}
