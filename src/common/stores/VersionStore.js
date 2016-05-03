// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv1_1 from '../messengers/RackHDRestAPIv1_1';

export default class VersionsStore extends Store {

  key = 'package';

  get() {
    return RackHDRestAPIv1_1.versions.get()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  list() {
    return RackHDRestAPIv1_1.versions.get()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

}
