// Copyright 2015, EMC, Inc.

'use strict';

import { API } from '../config/index';
import RestAPI from 'common-web-ui/lib/RestAPI';

export default class SystemsActionsAPI extends RestAPI {

  api = API;
  entity = 'ManagedSystems/Systems';

  getSystemResetActions(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id + '/Actions/ComputerSystem.Reset')
        .set('Authentication-Token', window.localStorage['onrack-auth-token'])
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  postSystemResetAction(id, reset_type) { // eslint-disable-line camelcase
    return new Promise((resolve, reject) => {
      this.http.post(this.url + id + '/Actions/ComputerSystem.Reset')
        .set('Authentication-Token', window.localStorage['onrack-auth-token'])
        .accept('json')
        .type('json')
        .send({ reset_type }) // eslint-disable-line camelcase
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  getSystemBootImages(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id + '/OEM/OnRack/Actions/OnRack.BootImage')
        .set('Authentication-Token', window.localStorage['onrack-auth-token'])
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  postSystemBootImage(boot_image) { // eslint-disable-line camelcase
    return new Promise((resolve, reject) => {
      this.http.post(this.url + 'nodes')
        .set('Authentication-Token', window.localStorage['onrack-auth-token'])
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
