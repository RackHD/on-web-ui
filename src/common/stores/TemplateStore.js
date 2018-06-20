// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv2_0 from '../messengers/RackHDRestAPIv2_0';

export default class TemplateStore extends Store {

  api = RackHDRestAPIv2_0.url;
  resource = 'templates';

  list() {
    return RackHDRestAPIv2_0.api.templatesMetaGet()
      .then(res => this.recollect(res.obj))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return RackHDRestAPIv2_0.api.templatesLibGet({name: id})
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return RackHDRestAPIv2_0.api.templatesLibPut({name: id, body: data})
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return RackHDRestAPIv2_0.api.templatesLibPut({name: id, body: data})
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

}
