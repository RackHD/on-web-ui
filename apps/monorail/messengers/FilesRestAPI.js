'use strict';

import { API } from '../config/index';
import http from 'superagent';

export default class FilesRestAPI {

  api = API;
  entity = 'files';

  get url() {
    if (this.api.charAt(this.api.length - 1) !== '/') { this.api += '/'; }
    return this.api + this.entity + '/';
  }

  del(uuid) {
    return new Promise((resolve, reject) => {
      http.del(this.url + uuid)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  get(filename) {
    return new Promise((resolve, reject) => {
      http.get(this.url + filename)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && (res.body || res.text));
        });
    });
  }

  list() {
    return new Promise((resolve, reject) => {
      http.get(this.url + 'list/all')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  md5(filename) {
    return new Promise((resolve, reject) => {
      http.get(this.url + 'md5/' + filename)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  metadata(filename) {
    return new Promise((resolve, reject) => {
      http.get(this.url + 'metadata/' + filename)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  put(filename, body) {
    return new Promise((resolve, reject) => {
      http.put(this.url + filename)
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
