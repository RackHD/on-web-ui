// Copyright 2015, EMC, Inc.

'use strict';

import config from '../config/index';
import RestAPI from 'common-web-ui/lib/RestAPI';

export default class FilesRestAPI extends RestAPI {

  api = config.MONORAIL_API;
  entity = 'files';

  del(uuid) {
    return new Promise((resolve, reject) => {
      this.http.del(this.url + uuid)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  get(filename) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + filename)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && (res.body || res.text));
        });
    });
  }

  list() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'list/all')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  md5(filename) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'md5/' + filename)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  metadata(filename) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'metadata/' + filename)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  put(filename, body) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + filename)
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
