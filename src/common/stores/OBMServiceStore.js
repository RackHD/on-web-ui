// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv2_0 from '../messengers/RackHDRestAPIv2_0';

export default class OBMServiceStore extends Store {

  key = 'service';

  read(id) {
    return RackHDRestAPIv2_0.api.obmsGetById({identifier: id})
      .then(res => this.change(id, res.obj))
      .catch(err => this.error(null, err));
  }

  list() {
    return RackHDRestAPIv2_0.api.obmsGet()
      .then(res => this.recollect(res.obj))
      .catch(err => this.error(null, err));
  }

}
