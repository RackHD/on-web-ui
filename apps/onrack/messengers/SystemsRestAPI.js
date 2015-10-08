// Copyright 2015, EMC, Inc.

'use strict';

import { API } from '../config/index';
import RestAPI from 'common-web-ui/lib/RestAPI';

export default class SystemsResetAPI extends RestAPI {

  api = API;
  entity = 'ManagedSystems/Systems';

  getSystemsCollection() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url)
        .set('Authentication-Token', window.localStorage['onrack-auth-token'])
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  getSystem(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id)
        .set('Authentication-Token', window.localStorage['onrack-auth-token'])
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

};
