// Copyright 2015, EMC, Inc.

'use strict';

import RestAPI from '../lib/RestAPI';

export default class NodesRestAPI extends RestAPI {

  entity = 'nodes';

  unsupportedMethods = ['put'];

  getObm(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id + '/obm')
        .accept('json')
        .set('authorization', this.jwtAuthorization)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  updateObm(id, body) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + id + '/obm')
        .accept('json')
        .type('json')
        .set('authorization', this.jwtAuthorization)
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  turnObmLightOn(id) {
    return this.toggleObmLight(id, true);
  }

  turnObmLightOff(id) {
    return this.toggleObmLight(id, false);
  }

  toggleObmLight(id, value) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + id + '/obm')
        .accept('json')
        .type('json')
        .set('authorization', this.jwtAuthorization)
        .send(value)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  listCatalogs(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id + '/catalogs')
        .accept('json')
        .set('authorization', this.jwtAuthorization)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  listSourceCatalogs(id, source) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id + '/catalogs/' + source)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  listPollers(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id + '/pollers')
        .accept('json')
        .set('authorization', this.jwtAuthorization)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  postDHCPWhitelistMAC(macAddress) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + macAddress + '/dhcp/whitelist')
        .accept('json')
        .set('authorization', this.jwtAuthorization)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  deleteDHCPWhitelistMAC(macAddress) {
    return new Promise((resolve, reject) => {
      this.http.del(this.url + macAddress + '/dhcp/whitelist')
        .accept('json')
        .set('authorization', this.jwtAuthorization)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  listWorkflows(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id + '/workflows')
        .accept('json')
        .set('authorization', this.jwtAuthorization)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  postWorkflow(nodeId, body) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + nodeId + '/workflows')
        .accept('json')
        .type('json')
        .set('authorization', this.jwtAuthorization)
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  getActiveWorkflow(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id + '/workflows/active')
        .accept('json')
        .set('authorization', this.jwtAuthorization)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  deleteActiveWorkflow(id) {
    return new Promise((resolve, reject) => {
      this.http.del(this.url + id + '/workflows/active')
        .accept('json')
        .set('authorization', this.jwtAuthorization)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

}
