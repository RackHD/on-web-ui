// Copyright 2015, EMC, Inc.

'use strict';

import config from '../config/index';
import RestAPI from 'common-web-ui/lib/RestAPI';

export default class ProfilesRestAPI extends RestAPI {

  api = config.MONORAIL_API;
  entity = 'profiles';

  get(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'library/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  list() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'library/')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  put(id, body) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + 'library/' + id)
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
