'use strict';

import Store from 'common-web-ui/lib/Store';

import VersionsRestAPI from '../messengers/VersionsRestAPI';

export default class VersionsStore extends Store {

  versionsRestAPI =  new VersionsRestAPI();

  key = 'package';

  get() {
    this.empty();
    return this.versionsRestAPI.get()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  list() {
    this.empty();
    return this.versionsRestAPI.get()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

}
