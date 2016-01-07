// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import MonoRailRestAPIv1_1 from '../messengers/MonoRailRestAPIv1_1';

export default class ProfileStore extends Store {

  api = MonoRailRestAPIv1_1.url;
  resource = 'profiles';

  list() {
    return MonoRailRestAPIv1_1.profiles.list()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return MonoRailRestAPIv1_1.profiles.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return MonoRailRestAPIv1_1.profiles.put(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return MonoRailRestAPIv1_1.profiles.put(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

}
