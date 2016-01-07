// Copyright 2015, EMC, Inc.

'use strict';

import RestAPI from '../lib/RestAPI';

export default class TasksRestAPI extends RestAPI {

  entity = 'tasks';

  unsupportedMethods = ['post', 'put', 'patch', 'delete'];

  get workflowsUrl() { return this.getResourceUrl('workflows'); }

  list() { return this.library(); }

  put(body) {
    if (!body) {
      body = id;
      id = '';
    }
    return super.put(id || '', body, 'json');
  }

  library() {
    return new Promise((resolve, reject) => {
      this.http.get(this.workflowsUrl + 'tasks/library')
        .accept('json')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.body);
        });
    });
  }

}
