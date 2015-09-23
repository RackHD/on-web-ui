// Copyright 2015, EMC, Inc.

'use strict';

import { API } from '../config/index';
import http from 'superagent';

export default class ProfilesRestAPI {

  api = API;
  entity = 'profiles';

  get url() {
    if (this.api.charAt(this.api.length - 1) !== '/') { this.api += '/'; }
    return this.api + this.entity + '/';
  }

  get(id) {
    return new Promise((resolve, reject) => {
      http.get(this.url + 'library/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  list() {
    return new Promise((resolve, reject) => {
      http.get(this.url + 'library/')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  put(id, body) {
    return new Promise((resolve, reject) => {
      http.put(this.url + 'library/' + id)
        .accept('json')
        .type('application/octet-stream')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

}
