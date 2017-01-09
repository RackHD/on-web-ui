// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv2_0 from '../messengers/RackHDRestAPIv2_0';

export default class SchemaStore extends Store {

  read(id) {
    return RackHDRestAPIv2_0.api.schemasIdGet({identifier: id})
      .then(res => this.change(id, res.obj))
      .catch(err => this.error(id, err));
  }

  list() {
    return RackHDRestAPIv2_0.api.schemasGet()
      .then(res => this.recollect(res.obj))
      .catch(err => this.error(null, err));
  }

}
