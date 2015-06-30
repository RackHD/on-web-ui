'use strict';

import Store from 'common-web-ui/lib/Store';

import NodesRestAPI from '../messengers/NodesRestAPI';

export default class NodeStore extends Store {

  nodesRestAPI = new NodesRestAPI();

  list() {
    this.empty();
    return this.nodesRestAPI.list()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return this.nodesRestAPI.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return this.nodesRestAPI.post(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return this.nodesRestAPI.patch(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return this.nodesRestAPI.delete(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
