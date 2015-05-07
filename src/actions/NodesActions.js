'use strict';

import { API } from '../config';
import http from 'superagent';

export default {

  getNodes() {
    return new Promise(function (resolve, reject) {
      http.get(API + 'nodes')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  postNodes(body) {
    return new Promise(function (resolve, reject) {
      http.post(API + 'nodes')
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

};
