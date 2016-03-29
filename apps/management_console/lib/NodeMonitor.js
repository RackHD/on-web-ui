'use strict';

import ElasticsearchAPI from 'rui-common/messengers/ElasticsearchAPI';
import EventsMessenger from 'rui-common/messengers/EventsMessenger';
import LogsMessenger from 'rui-common/messengers/LogsMessenger';

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

  load(offset=0, size=100) {
    return ElasticsearchAPI.search({
      q: 'subject:' + this.nodeId,
      sort: 'timestamp:desc',
      index: 'logstash-*',
      from: offset,
      size: size
    });
  }

  prependHits(hits, handler) {
    hits.forEach(hit => {
      handler({data: hit._source});
    });
  }

  ignore() {
    this.logs.ignore();
  }

  connect(handler) {
    let listenAndConnect = () => {
      this.listen(handler);
      this.logs.connect();
    };
    this.load()
      .then(res => {
        this.prependHits(res.hits.hits, handler);
        listenAndConnect();
      })
      .catch(listenAndConnect);
  }

  disconnect() {
    this.ignore();
    this.logs.disconnect();
  }

}
