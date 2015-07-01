'use strict';

import { API } from '../config/index';
import http from 'superagent';

export default class WorkflowsRestAPI {

  api = API;
  entity = 'tasks';

  get url() { return this.getEntityUrl(this.entity); }

  get workflowsUrl() { return this.getEntityUrl('workflows'); }

  getEntityUrl(entity) {
    if (this.api.charAt(this.api.length - 1) !== '/') { this.api += '/'; }
    return this.api + entity + '/';
  }

  list() {
    return new Promise((resolve, reject) => {
      http.get(this.workflowsUrl + 'tasks/library')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

}
