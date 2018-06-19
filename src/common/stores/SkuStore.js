// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv2_0 from '../messengers/RackHDRestAPIv2_0';

export default class SkuStore extends Store {

  api = RackHDRestAPIv2_0.url;
  resource = 'skus';

  list() {
    return RackHDRestAPIv2_0.api.skusGet()
      .then(res => this.recollect(res.obj))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return RackHDRestAPIv2_0.api.skusIdGet({identifier: id})
      .then(res => this.change(id, res.obj))
      .catch(err => this.error(id, err));
  }

  create(data) {
    return RackHDRestAPIv2_0.api.skusPost({body: data})
      .then(() => this.insert(data))
      .catch(err => this.error(null, err));
  }

  update(id, data) {
    return RackHDRestAPIv2_0.api.skusPatch({identifier: id, body: data})
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return RackHDRestAPIv2_0.api.skusIdDelete({identifier: id})
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
