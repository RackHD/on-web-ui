'use strict';

import { API } from '../config';
import http from 'superagent';

export default {

  getActivities() {
    return new Promise(function (resolve, reject) {
      http.get(API + 'activities')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

};
