// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import TemplatesRestAPI from '../messengers/TemplatesRestAPI';

export default class TemplateStore extends Store {

  templatesRestAPI = new TemplatesRestAPI();

  api = this.templatesRestAPI.api;
  resource = 'templates';

  list() {
    return this.templatesRestAPI.list()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return this.templatesRestAPI.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return this.templatesRestAPI.put(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return this.templatesRestAPI.put(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

}
