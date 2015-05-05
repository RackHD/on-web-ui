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
          resolve(res && res.body || res.text);
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
          resolve(res && res.body || res.text);
        });
    });
  },

  deleteNode(id) {
    return new Promise(function (resolve, reject) {
      http.delete(API + 'nodes/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body || res.text);
        });
    });
  }

};
