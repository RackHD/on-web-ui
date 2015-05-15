'use strict';

import { API } from '../../config';
import http from 'superagent';

export default {

  getChassisCollection() {
    return new Promise(function (resolve, reject) {
      http.get(API + 'ManagedSystems/ChassisCollection')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  getChassis(id) {
    return new Promise(function (resolve, reject) {
      http.get(API + 'ManagedSystems/Chassis/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

};
