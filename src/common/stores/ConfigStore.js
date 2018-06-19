// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv2_0 from '../messengers/RackHDRestAPIv2_0';

export default class ConfigStore extends Store {

  read() {
    return RackHDRestAPIv2_0.api.configGet()
      .then(res => this.change('config', res.obj))
      .catch(err => this.error(null, err));
  }

  list() {
    this.empty();
    return RackHDRestAPIv2_0.api.configGet()
      .then(res => this.change('config', res.obj))
      .catch(err => this.error(null, err));
  }

  update(data) {
    return RackHDRestAPIv2_0.api.configPatch({config: data})
      .then(res => this.change('config', data))
      .catch(err => this.error(null, err));
  }

}
