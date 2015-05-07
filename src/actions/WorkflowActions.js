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
          resolve(res && res.body);
        });
    });
  },

  getWorkflowTemplate(id) {
    return new Promise(function (resolve, reject) {
      http.get(API + 'workflows/library/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          // TODO: merge together similar templates.
          resolve(res && res.body && res.body[0]);
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
          resolve(res && res.body);
        });
    });
  },

  deleteWorkflow(id) {
    return new Promise(function (resolve, reject) {
      http.del(API + 'workflows/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

};
