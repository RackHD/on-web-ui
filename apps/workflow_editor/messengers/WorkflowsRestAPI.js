// Copyright 2015, EMC, Inc.

'use strict';

import { API } from '../config/index';
import RestAPI from 'common-web-ui/lib/RestAPI';

export default class WorkflowsRestAPI extends RestAPI {

  api = API;
  entity = 'workflows';

  get workflowsUrl() { return this.getResourceUrl('workflows'); }

  list() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'library')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

  put(body) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url)
        .accept('json')
        .type('application/json')
        .send(body)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

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

}
