'use strict';

import { API } from '../config';
import http from 'superagent';

export default {

  getWorkflow(id) {
    return new Promise(function (resolve, reject) {
      http.get(API + 'workflows/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body || res.text);
        });
    });
  },

  getWorkflowTemplate(id) {
    return new Promise(function (resolve, reject) {
      http.get(API + 'workflows/library/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body || res.text);
        });
    });
  },

  patchWorkflow(id, body) {
    return new Promise(function (resolve, reject) {
      http.patch(API + 'workflows/' + id)
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body || res.text);
        });
    });
  },

  deleteWorkflow(id) {
    return new Promise(function (resolve, reject) {
      http.del(API + 'workflows/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body || res.text);
        });
    });
  }

};
