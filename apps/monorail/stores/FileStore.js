// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import MonoRailRestAPIv1_1 from '../messengers/MonoRailRestAPIv1_1';

export default class NodeStore extends Store {

  api = MonoRailRestAPIv1_1.url;
  resource = 'files';

  key = 'uuid';

  list() {
    return MonoRailRestAPIv1_1.files.list()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  read(filename) {
    return MonoRailRestAPIv1_1.files.get(filename)
      .then(item => this.assign(filename, {body: item}))
      .catch(err => this.error(filename, err));
  }

  create(filename, data) {
    return MonoRailRestAPIv1_1.files.put(filename, data)
      .then(() => this.insert(filename, data))
      .catch(err => this.error(filename, err));
  }

  update(filename, data) {
    return MonoRailRestAPIv1_1.files.put(filename, data)
      .then(() => this.change(filename, data))
      .catch(err => this.error(filename, err));
  }

  destroy(uuid, filename=uuid) {
    return MonoRailRestAPIv1_1.files.delete(uuid)
      .then(() => this.remove(filename))
      .catch(err => this.error(filename, err));
  }

}
