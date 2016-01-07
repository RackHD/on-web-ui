// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import MonoRailRestAPIv1_1 from '../messengers/MonoRailRestAPIv1_1';

export default class PollerStore extends Store {

  api = MonoRailRestAPIv1_1.url;
  resource = 'pollers';

  list() {
    return MonoRailRestAPIv1_1.pollers.list()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return MonoRailRestAPIv1_1.pollers.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return MonoRailRestAPIv1_1.pollers.post(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return MonoRailRestAPIv1_1.pollers.patch(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return MonoRailRestAPIv1_1.pollers.delete(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

  listNode(nodeId) {
    this.empty();
    return MonoRailRestAPIv1_1.nodes.listPollers(nodeId)
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

}
