// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv1_1 from '../messengers/RackHDRestAPIv1_1';

export default class SkuStore extends Store {

  api = RackHDRestAPIv1_1.url;
  resource = 'skus';

  list() {
    return RackHDRestAPIv1_1.skus.list()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return RackHDRestAPIv1_1.skus.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(data) {
    return RackHDRestAPIv1_1.skus.post(data)
      .then(() => this.insert(data))
      .catch(err => this.error(null, err));
  }

  update(id, data) {
    return RackHDRestAPIv1_1.skus.patch(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return RackHDRestAPIv1_1.skus.delete(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
