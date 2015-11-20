// Copyright 2015, EMC, Inc.

'use strict';

import config from '../config/index';
import RestAPI from 'common-web-ui/lib/RestAPI';

export default class NodesRestAPI extends RestAPI {

  api = config.MONORAIL_API;
  entity = 'nodes';

  get(id) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + id)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  list() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url)
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  post(body) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url)
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
      this.http.patch(this.url + id)
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
    return new Promise((resolve, reject) => {
      this.http.del(this.url + id)
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
      this.http.get(this.url + id + '/obm')
        .accept('json')
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
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

}
