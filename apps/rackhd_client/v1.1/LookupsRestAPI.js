// Copyright 2015, EMC, Inc.

'use strict';

import RestAPI from '../lib/RestAPI';

export default class LookupsRestAPI extends RestAPI {

  entity = 'lookups';

  unsupportedMethods = ['put'];

  list(q) {
    q = q || '';
    return new Promise((resolve, reject) => {
      this.http.get(this.url + '?' + this.qs.stringify({q}))
        .accept('json')
        .set('authorization', this.jwtAuthorization)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

}
