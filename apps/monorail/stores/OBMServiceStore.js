'use strict';

import Store from 'common-web-ui/lib/Store';

import OBMServicesRestAPI from '../messengers/OBMServicesRestAPI';

export default class OBMServiceStore extends Store {

  obmServicesRestAPI =  new OBMServicesRestAPI();

  key = 'service';

  read(id) {
    return this.obmServicesRestAPI.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  list() {
    this.empty();
    return this.obmServicesRestAPI.list()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

}
