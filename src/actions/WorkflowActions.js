'use strict';

import API from '../core/API';
import http from 'superagent';

export default {

  requestWorkflows() {
    return new Promise(function (resolve, reject) {
      http.get(API + 'workflows')
        .accept('application/json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body || res.text);
        });
    });
  }

};
