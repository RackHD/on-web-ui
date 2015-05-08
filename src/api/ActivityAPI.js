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
  },

  postActivities(body) {
    return new Promise(function (resolve, reject) {
      http.post(API + 'activities')
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  getActivity(id) {
    return new Promise(function (resolve, reject) {
      http.get(API + 'activities/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  patchActivity(id, body) {
    return new Promise(function (resolve, reject) {
      http.patch(API + 'activities/' + id)
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  deleteActivity(id) {
    return new Promise(function (resolve, reject) {
      http.del(API + 'activities/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

};
