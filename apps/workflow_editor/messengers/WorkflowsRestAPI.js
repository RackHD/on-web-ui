// Copyright 2015, EMC, Inc.

'use strict';

import { API } from '../config/index';
import http from 'superagent';

export default class WorkflowsRestAPI {

  api = API;
  entity = 'workflows';

  get url() {
    if (this.api.charAt(this.api.length - 1) !== '/') { this.api += '/'; }
    return this.api + this.entity + '/';
  }

  list() {
    return new Promise((resolve, reject) => {
      http.get(this.url + 'library')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  put(body) {
    return new Promise((resolve, reject) => {
      http.put(this.url)
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      http.get(this.url + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

}
