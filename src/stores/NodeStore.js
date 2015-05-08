'use strict';

import Store from '../lib/Store';

import NodeAPI from '../api/NodeAPI';

export default class NodeStore extends Store {

  fetch() {
    this.empty();
    return NodeAPI.getNodes()
      .then(nodes => this.collect(nodes))
      .catch(err => console.error(err));
  }

}
