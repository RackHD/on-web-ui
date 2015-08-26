'use strict';

import Store from 'common-web-ui/lib/Store';

import PollersRestAPI from '../messengers/PollersRestAPI';
import NodesRestAPI from '../messengers/NodesRestAPI';

export default class PollerStore extends Store {

  pollersRestAPI = new PollersRestAPI();
  nodesRestAPI = new NodesRestAPI();

  list() {
    this.empty();
    return this.pollersRestAPI.list()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return this.pollersRestAPI.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return this.pollersRestAPI.post(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return this.pollersRestAPI.patch(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return this.pollersRestAPI.delete(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

  listNode(nodeId) {
    this.empty();
    return this.nodesRestAPI.listPollers(nodeId)
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

}
