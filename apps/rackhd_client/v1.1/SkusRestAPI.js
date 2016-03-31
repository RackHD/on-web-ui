// Copyright 2015, EMC, Inc.

'use strict';

import RestAPI from '../lib/RestAPI';

export default class SkusRestAPI extends RestAPI {

  entity = 'skus';

  unsupportedMethods = ['put'];

  listNodes() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id + '/nodes')
        .accept('json')
        .set('authorization', this.jwtAuthorization)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  // TODO: more api calls

}
