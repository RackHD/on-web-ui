// Copyright 2015, EMC, Inc.

import RestAPI from '../lib/RestAPI';

export default class ConfigRestAPI extends RestAPI {

  entity = 'config';

  unsupportedMethods = ['list', 'post', 'put', 'delete'];

  get() {
    return super.get('');
  }

  patch(body) {
    return new Promise((resolve, reject) => {
      this.http.patch(this.url)
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

}
