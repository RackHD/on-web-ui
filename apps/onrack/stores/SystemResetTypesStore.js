// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import SystemsActionsRestAPI from '../messengers/SystemsActionsRestAPI';

export default class SystemResetTypesStore extends Store {

  systemsActionsRestAPI = new SystemsActionsRestAPI();

  list(systemId) {
    this.empty();
    return this.systemsActionsRestAPI.getSystemResetActions(systemId)
      .then(list => this.collect(list.map(id => ({ id }))))
      .catch(err => this.error(null, err));
  }

  sendReset(resetType) {
    return this.systemsActionsRestAPI.postSystemResetAction(resetType)
      .catch(err => this.error(null, err));
  }

}
