// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import SystemsActionsRestAPI from '../messengers/SystemsActionsRestAPI';

export default class SystemBootImagesStore extends Store {

  systemsActionsRestAPI = new SystemsActionsRestAPI();

  list(systemId) {
    this.empty();
    return this.systemActionsRestAPI.getSystemBootImages(systemId)
      .then(list => this.collect(list.map(id => ({ id }))))
      .catch(err => this.error(null, err));
  }

  sendBoot(bootImage) {
    return this.systemActionsRestAPI.postSystemBootImage(bootImage)
      .catch(err => this.error(null, err));
  }

}
