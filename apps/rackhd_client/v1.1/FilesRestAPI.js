// Copyright 2015, EMC, Inc.

'use strict';

import RestAPI from '../lib/RestAPI';

export default class FilesRestAPI extends RestAPI {

  entity = 'files';

  unsupportedMethods = ['post', 'patch'];

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

  latest(filename) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + filename + '/latest')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  md5(filename) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'md5/' + filename + '/latest')
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

}
