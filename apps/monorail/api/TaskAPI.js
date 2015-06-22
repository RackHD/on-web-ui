'use strict';

import { API } from '../config/index';
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
  },

  postTasks(body) {
    return new Promise(function (resolve, reject) {
      http.post(API + 'tasks')
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  getTask(id) {
    return new Promise(function (resolve, reject) {
      http.get(API + 'tasks/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  patchTask(id, body) {
    return new Promise(function (resolve, reject) {
      http.patch(API + 'tasks/' + id)
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  deleteTask(id) {
    return new Promise(function (resolve, reject) {
      http.del(API + 'tasks/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

};
