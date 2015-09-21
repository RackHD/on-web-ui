'use strict';

import { API } from '../config/index';
import http from 'superagent';

export default class PollersRestAPI {

  api = API;
  entity = 'pollers';

  get url() {
    if (this.api.charAt(this.api.length - 1) !== '/') { this.api += '/'; }
    return this.api + this.entity + '/';
  }

  del(id) {
    return new Promise((resolve, reject) => {
      http.del(this.url + id)
        .accept('json')
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

  list() {
    return new Promise((resolve, reject) => {
      http.get(this.url)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  currentData(id) {
    return new Promise((resolve, reject) => {
      http.get(this.url + id + '/data/current')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  library(id) {
    return new Promise((resolve, reject) => {
      http.get(this.url + 'library' + id ? '/' + id : '')
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
      http.put(this.url + id)
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
      http.put(this.url + id + '/pause')
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
      http.put(this.url + id + '/resume')
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
