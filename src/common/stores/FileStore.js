// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv2_0 from '../messengers/RackHDRestAPIv2_0';

export default class NodeStore extends Store {

  api = RackHDRestAPIv2_0.url;
  resource = 'files';

  key = 'uuid';

  list() {
    return RackHDRestAPIv2_0.api.filesGetAll()
      .then(res => this.recollect(res.obj))
      .catch(err => this.error(null, err));
  }

  read(filename) {
    return RackHDRestAPIv2_0.api.filesGet({fileidentifier: filename})
      .then(res => this.change(filename, {body: res.obj}))
      .catch(err => this.error(filename, err));
  }

  create(filename, data) {
    return this.update(filename, data, true);
  }

  update(filename, data, shouldInsert) {
    // TODO: fix api2.0 send data
    return RackHDRestAPIv2_0.api.filesPut({fileidentifier: filename})
      .then(res => this[shouldInsert ? 'insert' : 'change'](filename, res.obj))
      .catch(err => this.error(filename, err));
  }

  destroy(uuid, filename=uuid) {
    return RackHDRestAPIv2_0.api.filesDelete({fileidentifier: uuid})
      .then(res => this.remove(filename, res.obj))
      .catch(err => this.error(filename, err));
  }

}
