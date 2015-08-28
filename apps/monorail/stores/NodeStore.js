'use strict';

import Store from 'common-web-ui/lib/Store';

import NodesRestAPI from '../messengers/NodesRestAPI';

export default class NodeStore extends Store {

  nodesRestAPI = new NodesRestAPI();

  list() {
    return this.nodesRestAPI.list()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return this.nodesRestAPI.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(data) {
    return this.nodesRestAPI.post(data)
      .then(() => this.insert(data))
      .catch(err => this.error(null, err));
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
