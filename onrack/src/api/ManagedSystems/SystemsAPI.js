'use strict';

import { API } from '../../config';
import http from 'superagent';

export default {

  getSystemsCollection() {
    return new Promise(function (resolve, reject) {
      http.get(API + 'ManagedSystems/SystemsCollection')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  getSystem(id) {
    return new Promise(function (resolve, reject) {
      http.get(API + 'ManagedSystems/Systems/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

};
