'use strict';

import { API } from '../../config';
import http from 'superagent';

export default {

  getSystemResetActions(id) {
    return new Promise(function (resolve, reject) {
      http.get(API + 'ManagedSystems/Systems/' + id + '/Actions/ComputerSystem.Reset')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  postSystemResetAction(id, reset_type) { // eslint-disable-line camelcase
    return new Promise(function (resolve, reject) {
      http.post(API + 'ManagedSystems/Systems/' + id + '/Actions/ComputerSystem.Reset')
        .accept('json')
        .type('json')
        .send({ reset_type }) // eslint-disable-line camelcase
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  getSystemBootImages(id) {
    return new Promise(function (resolve, reject) {
      http.get(API + 'ManagedSystems/Systems/' + id + '/OEM/OnRack/Actions/OnRack.BootImage')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  },

  postSystemBootImage(boot_image) { // eslint-disable-line camelcase
    return new Promise(function (resolve, reject) {
      http.post(API + 'nodes')
        .accept('json')
        .type('json')
        .send({ boot_image }) // eslint-disable-line camelcase
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

};
