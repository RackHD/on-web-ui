'use strict';

import Store from 'common-web-ui/lib/Store';

import SystemsActionsAPI from '../api/ManagedSystems/SystemsActionsAPI';

export default class SystemResetTypesStore extends Store {

  list(systemId) {
    this.empty();
    return SystemsActionsAPI.getSystemResetActions(systemId)
      .then(list => this.collect(list.map(id => ({ id }))))
      .catch(err => this.error(null, err));
  }

  sendReset(resetType) {
    return SystemsActionsAPI.postSystemResetAction(resetType)
      .catch(err => this.error(null, err));
  }

}
