'use strict';

import { API } from '../config/index';
import http from 'superagent';

export default class NodesRestAPI {

  api = API;
  entity = 'nodes';

  get url() {
    if (this.api.charAt(this.api.length - 1) !== '/') { this.api += '/'; }
    return this.api + this.entity + '/';
  }

  get(id) {
    return new Promise((resolve, reject) => {
      http.get(this.url + id).accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  list() {
    return new Promise((resolve, reject) => {
      http.get(this.url)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  post(body) {
    return new Promise((resolve, reject) => {
      http.post(this.url)
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  patch(id, body) {
    return new Promise((resolve, reject) => {
      http.patch(this.url + id)
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  delete(id) {
    return new Promise(function (resolve, reject) {
      http.del(this.url + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  // Special API calls:

  getObm(id) {
    return new Promise((resolve, reject) => {
      http.get(this.url + id + '/obm')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  updateObm(id, body) {
    return new Promise((resolve, reject) => {
      http.post(this.url + id + '/obm')
        .accept('json')
        .type('json')
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
      http.post(this.url + id + '/obm')
        .accept('json')
        .type('json')
        .send(value)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  getCatalogsBySource(id, source) {
    return new Promise((resolve, reject) => {
      http.get(this.url + id + '/catalogs/' + source)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  listPollers(id) {
    return new Promise((resolve, reject) => {
      http.get(this.url + id + '/pollers')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  postDHCPWhitelistMAC(macAddress) {
    return new Promise((resolve, reject) => {
      http.post(this.url + macAddress + '/dhcp/whitelist')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  deleteDHCPWhitelistMAC(macAddress) {
    return new Promise((resolve, reject) => {
      http.del(this.url + macAddress + '/dhcp/whitelist')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  listWorkflows(id) {
    return new Promise((resolve, reject) => {
      http.get(this.url + id + '/workflows')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  postWorkflow(id, body) {
    return new Promise((resolve, reject) => {
      http.post(this.url + id + '/workflows')
        .accept('json')
        .type('json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  getActiveWorkflow(id) {
    return new Promise((resolve, reject) => {
      http.get(this.url + id + '/workflows/active')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  deleteActiveWorkflow(id) {
    return new Promise((resolve, reject) => {
      http.del(this.url + id + '/workflows/active')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

}
