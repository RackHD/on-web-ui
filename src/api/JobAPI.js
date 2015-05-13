'use strict';

import { API } from '../config';
import http from 'superagent';

export default {

  getJobs() {
    return new Promise(function (resolve, reject) {
      http.get(API + 'jobs')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  // postJobs(body) {
  //   return new Promise(function (resolve, reject) {
  //     http.post(API + 'jobs')
  //       .accept('json')
  //       .type('json')
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) { return reject(err); }
  //         resolve(res && res.body);
  //       });
  //   });
  // },

  getJob(id) {
    return new Promise(function (resolve, reject) {
      http.get(API + 'jobs/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  // patchJob(id, body) {
  //   return new Promise(function (resolve, reject) {
  //     http.patch(API + 'jobs/' + id)
  //       .accept('json')
  //       .type('json')
  //       .send(body)
  //       .end((err, res) => {
  //         if (err) { return reject(err); }
  //         resolve(res && res.body);
  //       });
  //   });
  // },

  // deleteJob(id) {
  //   return new Promise(function (resolve, reject) {
  //     http.del(API + 'jobs/' + id)
  //       .accept('json')
  //       .end((err, res) => {
  //         if (err) { return reject(err); }
  //         resolve(res && res.body);
  //       });
  //   });
  // }

};
