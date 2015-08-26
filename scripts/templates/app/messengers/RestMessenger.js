'use strict';

import { API } from '../config/index';
import http from 'superagent';

export default {

  getObjects() {
    return new Promise((resolve, reject) => {
      http.get(API + 'objects')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  postObjects(body) {
    return new Promise((resolve, reject) => {
      http.post(API + 'objects')
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  getObject(id) {
    return new Promise((resolve, reject) => {
      http.get(API + 'objects/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  patchObject(id, body) {
    return new Promise((resolve, reject) => {
      http.patch(API + 'objects/' + id)
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  deleteObject(id) {
    return new Promise((resolve, reject) => {
      http.del(API + 'objects/' + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

};
