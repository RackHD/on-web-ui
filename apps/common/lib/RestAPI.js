// Copyright 2015, EMC, Inc.

'use strict';

import qs from 'querystring';
import http from 'superagent';

export default class RestAPI {

  api = '';
  entity = '';
  http = http;
  qs = qs;

  constructor(api, entity) {
    this.api = api || this.api;
    this.entity = entity || this.entity;
  }

  get url() { return this.getResourceUrl(this.entity)  }

  getResourceUrl(resource) {
    if (this.api.charAt(this.api.length - 1) !== '/') { this.api += '/'; }
    return this.api + resource + '/';
  }

  get(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && (res.body || res.text));
        });
    });
  }

}
