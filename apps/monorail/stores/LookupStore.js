// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import MonoRailRestAPIv1_1 from '../messengers/MonoRailRestAPIv1_1';

export default class NodeStore extends Store {

  list(q) {
    this.empty();
    return MonoRailRestAPIv1_1.lookups.list(q)
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return MonoRailRestAPIv1_1.lookups.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return MonoRailRestAPIv1_1.lookups.post(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return MonoRailRestAPIv1_1.lookups.patch(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return MonoRailRestAPIv1_1.lookups.delete(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
