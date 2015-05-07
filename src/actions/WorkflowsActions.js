'use strict';

import { API } from '../config';
import http from 'superagent';

export default {

  getWorkflows() {
    return new Promise(function (resolve, reject) {
      http.get(API + 'workflows')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  getWorkflowsLibrary() {
    return new Promise(function (resolve, reject) {
      http.get(API + 'workflows/library')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          var ids = new Set(),
              body = res && res.body,
              list = [];
          if (body) {
            for (var item of body) {
              if (ids.has(item.injectableName)) { continue; }
              ids.add(item.injectableName);
              list.push(item);
            }
          }
          resolve(list);
        });
    });
  },

  postWorkflows(body) {
    return new Promise(function (resolve, reject) {
      http.post(API + 'workflows')
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
