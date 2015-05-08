'use strict';

import { API } from '../config';
import http from 'superagent';

export default {

  getTasks() {
    return new Promise(function (resolve, reject) {
      http.get(API + 'tasks')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

};
