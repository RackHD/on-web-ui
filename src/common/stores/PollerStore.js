// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv2_0 from '../messengers/RackHDRestAPIv2_0';

export default class PollerStore extends Store {

  api = RackHDRestAPIv2_0.url;
  resource = 'pollers';

  list() {
    return RackHDRestAPIv2_0.api.pollersGet()
      .then(res => this.recollect(res.obj))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return RackHDRestAPIv2_0.api.pollersIdGet({identifier: id})
      .then(res => this.change(id, res.obj))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    data.id = id;
    return RackHDRestAPIv2_0.api.pollersPost({content: data})
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return RackHDRestAPIv2_0.api.pollersPatch({identifier: id, content: data})
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return RackHDRestAPIv2_0.api.pollersDelete(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

  listNode(nodeId) {
    this.empty();
    return RackHDRestAPIv2_0.api.nodesGetPollersById({identifier: nodeId})
      .then(res => this.collect(res.obj))
      .catch(err => this.error(null, err));
  }

}
