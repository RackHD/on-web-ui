// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv2_0 from '../messengers/RackHDRestAPIv2_0';

export default class LookupStore extends Store {

  list(q) {
    this.empty();
    return RackHDRestAPIv2_0.api.lookupsGet({ q })
      .then(res => this.recollect(res.obj))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return RackHDRestAPIv2_0.api.lookupsGetById({ id })
      .then(res => this.change(id, res.obj))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return RackHDRestAPIv2_0.api.lookupsPost({body: data})
      .then(res => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return RackHDRestAPIv2_0.api.lookupsPatchById({ id, body: data})
      .then(res => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return RackHDRestAPIv2_0.api.lookupsDelById({ id })
      .then(res => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
