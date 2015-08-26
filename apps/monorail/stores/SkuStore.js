'use strict';

import Store from 'common-web-ui/lib/Store';

import SkusRestAPI from '../messengers/SkusRestAPI';

export default class SkuStore extends Store {

  skusRestAPI = new SkusRestAPI();

  list() {
    this.empty();
    return this.skusRestAPI.list()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return this.skusRestAPI.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(data) {
    return this.skusRestAPI.post(data)
      .then(() => this.insert(data))
      .catch(err => this.error(null, err));
  }

  update(id, data) {
    return this.skusRestAPI.patch(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return this.skusRestAPI.delete(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
