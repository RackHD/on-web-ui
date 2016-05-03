// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv1_1 from '../messengers/RackHDRestAPIv1_1';

export default class ConfigStore extends Store {

  read() {
    return RackHDRestAPIv1_1.config.get()
      .then(item => this.change('config', item))
      .catch(err => this.error(err));
  }

  list() {
    this.empty();
    return RackHDRestAPIv1_1.config.get()
      .then(item => this.change('config', item))
      .catch(err => this.error(null, err));
  }

  update(data) {
    return RackHDRestAPIv1_1.config.patch(data)
      .then(() => this.change('config', data))
      .catch(err => this.error('config', err));
  }

}
