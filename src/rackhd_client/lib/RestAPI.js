// Copyright 2015, EMC, Inc.

import qs from 'querystring';
import http from 'superagent';

export default class RestAPI {

  api = '';
  auth = '';
  entity = '';
  http = http;
  qs = qs;

  unsupported = [];

  constructor(api, auth, entity) {
    this.api = api || this.api;
    this.auth = auth || this.auth;
    this.entity = entity || this.entity;
  }

  get url() { return this.getResourceUrl(this.entity); }

  get jwtAuthorization() { return 'JWT ' + this.auth; }

  getResourceUrl(resource) {
    if (this.api.charAt(this.api.length - 1) !== '/') { this.api += '/'; }
    return this.api + resource + '/';
  }

  unsupportedPromise() {
    return new Promise((_, reject) => {
      reject(new Error('Unsupported method.'));
    });
  }

  list() {
    if (this.unsupportedMethods.indexOf('list') !== -1) {
      return this.unsupportedPromise();
    }

    return new Promise((resolve, reject) => {
      this.http.get(this.url)
        .accept('json')
        .set('authorization', this.jwtAuthorization)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  get(id) {
    if (this.unsupportedMethods.indexOf('get') !== -1) {
      return this.unsupportedPromise();
    }

    return new Promise((resolve, reject) => {
      this.http.get(this.url + id)
        .accept('json')
        .set('authorization', this.jwtAuthorization)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && (res.body || res.text));
        });
    });
  }

  post(body) {
    if (this.unsupportedMethods.indexOf('post') !== -1) {
      return this.unsupportedPromise();
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.url)
        .accept('json')
        .type('json')
        .set('authorization', this.jwtAuthorization)
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  patch(id, body) {
    if (this.unsupportedMethods.indexOf('patch') !== -1) {
      return this.unsupportedPromise();
    }

    return new Promise((resolve, reject) => {
      this.http.patch(this.url + id)
        .accept('json')
        .type('json')
        .set('authorization', this.jwtAuthorization)
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  put(id, body, type = 'application/octet-stream') {
    if (this.unsupportedMethods.indexOf('put') !== -1) {
      return this.unsupportedPromise();
    }

    return new Promise((resolve, reject) => {
      this.http.put(this.url + id)
        .accept('json')
        .type(type)
        .set('authorization', this.jwtAuthorization)
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  delete(id) {
    if (this.unsupportedMethods.indexOf('delete') !== -1) {
      return this.unsupportedPromise();
    }

    return new Promise((resolve, reject) => {
      this.http.del(this.url + id)
        .accept('json')
        .set('authorization', this.jwtAuthorization)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  del() {
    return this.delete(...arguments);
  }

}
