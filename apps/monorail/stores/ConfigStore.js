// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import MonoRailRestAPIv1_1 from '../messengers/MonoRailRestAPIv1_1';

export default class ConfigStore extends Store {

  read() {
    return MonoRailRestAPIv1_1.config.get()
      .then(item => this.change('config', item))
      .catch(err => this.error(err));
  }

  list() {
    this.empty();
    return MonoRailRestAPIv1_1.config.get()
      .then(item => this.change('config', item))
      .catch(err => this.error(null, err));
  }

  update(data) {
    return MonoRailRestAPIv1_1.config.patch(data)
      .then(() => this.change('config', data))
      .catch(err => this.error('config', err));
  }

}
