// Copyright 2015, EMC, Inc.

import RestAPI from '../lib/RestAPI';

export default class LoginRestAPI extends RestAPI {

  entity = 'login';

  unsupportedMethods = ['list', 'get', 'post', 'put', 'patch', 'delete'];

  authenticate(user, pass) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url)
        .accept('json')
        .type('json')
        .send({
          username: user,
          password: pass
        })
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body && res.body.token);
        });
    });
  }

}
