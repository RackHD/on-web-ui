'use strict';

import ElasticsearchAPI from 'rui-common/messengers/ElasticsearchAPI';
import EventsMessenger from 'rui-common/messengers/EventsMessenger';
import LogsMessenger from 'rui-common/messengers/LogsMessenger';

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
      // let history = JSON.parse(window.localStorage.getItem('logs-' + this.nodeId)) || [];
      // history.push(msg);
      // window.localStorage.setItem('logs-' + this.nodeId, JSON.stringify(history));
      handler(msg);
    });
  }

  ignore() {
    this.logs.ignore();
  }

  connect(handler) {
    ElasticsearchAPI.search({
      q: this.nodeId
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.error(err);
    });

    // let history = [];
    // try {
    //   history = JSON.parse(window.localStorage.getItem('logs-' + this.nodeId)) || [];
    // } catch (err) {
    //   window.localStorage.setItem('logs-' + this.nodeId, '[]');
    // }
    // history.forEach(handler);
    this.listen(handler);
    this.logs.connect();
  }

  disconnect() {
    this.ignore();
    this.logs.disconnect();
  }
}
