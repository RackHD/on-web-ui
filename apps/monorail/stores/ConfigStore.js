'use strict';

import Store from 'common-web-ui/lib/Store';

import ConfigRestAPI from '../messengers/ConfigRestAPI';

export default class ConfigStore extends Store {

  configRestAPI = new ConfigRestAPI();

  read() {
    return this.configRestAPI.get()
      .then(item => this.change('config', item))
      .catch(err => this.error(err));
  }

  list() {
    this.empty();
    return this.configRestAPI.get()
      .then(item => this.change('config', item))
      .catch(err => this.error(null, err));
  }

  update(data) {
    return this.configRestAPI.patch(data)
      .then(() => this.change('config', data))
      .catch(err => this.error('config', err));
  }

}
