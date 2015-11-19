// Copyright 2015, EMC, Inc.

'use strict';

import config from '../config/index';
import RestAPI from 'common-web-ui/lib/RestAPI';

export default class PollersRestAPI extends RestAPI {

  api = config.MONORAIL_API;
  entity = 'pollers';

  del(id) {
    return new Promise((resolve, reject) => {
      this.http.del(this.url + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
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

  currentData(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id + '/data/current')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  library(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'library' + id ? '/' + id : '')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  post(body) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url)
        .accept('json')
        .type('application/json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  patch(id, body) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + id)
        .accept('json')
        .type('application/json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  pause(id, body) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + id + '/pause')
        .accept('json')
        .type('application/json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  resume(id, body) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + id + '/resume')
        .accept('json')
        .type('application/json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

}
