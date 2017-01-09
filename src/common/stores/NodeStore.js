// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv2_0 from '../messengers/RackHDRestAPIv2_0';

export default class NodeStore extends Store {

  api = RackHDRestAPIv2_0.url;
  resource = 'nodes';

  list(params) {
    return RackHDRestAPIv2_0.api.nodesGetAll(params)
      .then(res => this.recollect(res.obj))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return RackHDRestAPIv2_0.api.nodesGetById({identifier: id})
      .then(res => this.change(id, res.obj))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    data.id = id;
    return RackHDRestAPIv2_0.api.nodesPost({body: data})
      .then(res => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return RackHDRestAPIv2_0.api.nodesPatchById({identifier: id, body: data})
      .then(res => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return RackHDRestAPIv2_0.api.nodesDelById({identifier: id})
      .then(res => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
