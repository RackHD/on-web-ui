// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import MonoRailRestAPIv1_1 from '../messengers/MonoRailRestAPIv1_1';

export default class VersionsStore extends Store {

  key = 'package';

  get() {
    return MonoRailRestAPIv1_1.versions.get()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  list() {
    return MonoRailRestAPIv1_1.versions.get()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

}
