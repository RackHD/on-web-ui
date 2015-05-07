'use strict';

import { API } from '../config';
import http from 'superagent';

export default {

  getNode(id) {
    return new Promise(function (resolve, reject) {
      http.get(API + 'nodes/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  patchNode(id, body) {
    return new Promise(function (resolve, reject) {
      http.patch(API + 'nodes/' + id)
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  deleteNode(id) {
    return new Promise(function (resolve, reject) {
      http.del(API + 'nodes/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

};
