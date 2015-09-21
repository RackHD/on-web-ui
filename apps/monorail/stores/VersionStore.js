'use strict';

import Store from 'common-web-ui/lib/Store';

import VersionsRestAPI from '../messengers/VersionsRestAPI';

export default class VersionsStore extends Store {

  versionsRestAPI =  new VersionsRestAPI();

  key = 'package';

  get() {
    return this.versionsRestAPI.get()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  list() {
    return this.versionsRestAPI.get()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

}
