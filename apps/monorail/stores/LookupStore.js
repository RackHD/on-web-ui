// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import LookupsRestAPI from '../messengers/LookupsRestAPI';

export default class NodeStore extends Store {

  lookupsRestAPI = new LookupsRestAPI();

  list(q) {
    this.empty();
    return this.lookupsRestAPI.list(q)
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return this.lookupsRestAPI.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return this.lookupsRestAPI.post(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return this.lookupsRestAPI.patch(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return this.lookupsRestAPI.delete(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
