'use strict';

import Store from 'common-web-ui/lib/Store';

import NodeAPI from '../api/NodeAPI';

export default class NodeStore extends Store {

  list() {
    this.empty();
    return NodeAPI.getNodes()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return NodeAPI.getNode(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return NodeAPI.postNode(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return NodeAPI.patchNode(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return NodeAPI.deleteNode(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
