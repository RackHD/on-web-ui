'use strict';

import API from '../core/API';
import http from 'superagent';

export default {

  getNodes() {
    return new Promise(function (resolve, reject) {
      http.get(API + 'nodes')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body || res.text);
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
          resolve(res && res.body || res.text);
        });
    });
  }

};
