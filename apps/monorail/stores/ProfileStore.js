'use strict';

import Store from 'common-web-ui/lib/Store';

import ProfilesRestAPI from '../messengers/ProfilesRestAPI';

export default class ProfileStore extends Store {

  profilesRestAPI = new ProfilesRestAPI();

  list() {
    this.empty();
    return this.profilesRestAPI.list()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return this.profilesRestAPI.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return this.profilesRestAPI.put(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return this.profilesRestAPI.put(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

}
