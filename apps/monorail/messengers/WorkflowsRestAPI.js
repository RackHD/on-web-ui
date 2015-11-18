// Copyright 2015, EMC, Inc.

'use strict';

import { MONORAIL_API } from '../config/index';
import RestAPI from 'common-web-ui/lib/RestAPI';

export default class WorkflowsRestAPI extends RestAPI {

  api = MONORAIL_API;
  entity = 'workflows';

  get url() {
    if (this.api.charAt(this.api.length - 1) !== '/') { this.api += '/'; }
    return this.api + this.entity + '/';
  }

  get(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  list() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  put(id, body) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + id)
        .accept('json')
        .type('application/octet-stream')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  library() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'library')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

}
