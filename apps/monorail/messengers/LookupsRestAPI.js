'use strict';

import { API } from '../config/index';
import http from 'superagent';
import qs from 'querystring';

export default class LookupsRestAPI {

  api = API;
  entity = 'lookups';

  get url() {
    if (this.api.charAt(this.api.length - 1) !== '/') { this.api += '/'; }
    return this.api + this.entity + '/';
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

  list(q) {
    q = q || '';
    return new Promise((resolve, reject) => {
      http.get(this.url + '?' + qs.stringify({q}))
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  post(body) {
    return new Promise((resolve, reject) => {
      http.post(this.url)
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  patch(id, body) {
    return new Promise((resolve, reject) => {
      http.patch(this.url + id)
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  delete(id) {
    return new Promise(function (resolve, reject) {
      http.del(this.url + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

}
