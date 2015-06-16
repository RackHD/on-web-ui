'use strict';

import Store from 'common-web-ui/lib/Store';

import SystemsActionsAPI from '../api/ManagedSystems/SystemsActionsAPI';

export default class SystemBootImagesStore extends Store {

  list(systemId) {
    this.empty();
    return SystemsActionsAPI.getSystemBootImages(systemId)
      .then(list => this.collect(list.map(id => ({ id }))))
      .catch(err => this.error(null, err));
  }

  sendBoot(bootImage) {
    return SystemsActionsAPI.postSystemBootImage(bootImage)
      .catch(err => this.error(null, err));
  }

}
