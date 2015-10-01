// Copyright 2015, EMC, Inc.

'use strict';

import { API } from '../config/index';
import http from 'superagent';

export default {

  auth(user, pass) {
    return new Promise((resolve, reject) => {
      http.post(API + 'login')
        .accept('json')
        .type('json')
        .send({email: user, password: pass})
        .end((err, res) => {
          if (err) { return reject(err); }
          let auth_token = res
            && res.body
            && res.body.response
            && res.body.response.user
            && res.body.response.user.authentication_token
            || null;
          window.localStorage['onrack-auth-token'] = auth_token,
          resolve(auth_token);
        });
    });
  }

};
