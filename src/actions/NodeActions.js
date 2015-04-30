'use strict';

import API from '../core/API';
import http from 'superagent';

export default {

  requestNodes() {
    return new Promise(function (resolve, reject) {
      http.get(API + 'nodes')
        .accept('application/json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body || res.text);
        });
    });
  }

};
