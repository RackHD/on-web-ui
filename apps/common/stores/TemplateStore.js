// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'rui-common/lib/Store';

import RackHDRestAPIv1_1 from '../messengers/RackHDRestAPIv1_1';

export default class TemplateStore extends Store {

  api = RackHDRestAPIv1_1.url;
  resource = 'templates';

  list() {
    return RackHDRestAPIv1_1.templates.list()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return RackHDRestAPIv1_1.templates.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return RackHDRestAPIv1_1.templates.put(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return RackHDRestAPIv1_1.templates.put(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

}
