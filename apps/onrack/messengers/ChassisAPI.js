// Copyright 2015, EMC, Inc.

'use strict';

import { API } from '../config/index';
import http from 'superagent';

export default {

  getChassisCollection() {
    return new Promise((resolve, reject) => {
      http.get(API + 'ManagedSystems/Chassis')
        .set('Authentication-Token', window.localStorage['onrack-auth-token'])
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  getChassis(id) {
    return new Promise((resolve, reject) => {
      http.get(API + 'ManagedSystems/Chassis/' + id)
        .set('Authentication-Token', window.localStorage['onrack-auth-token'])
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

};
