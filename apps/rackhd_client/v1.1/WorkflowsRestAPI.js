// Copyright 2015, EMC, Inc.

'use strict';

import RestAPI from '../lib/RestAPI';

export default class WorkflowsRestAPI extends RestAPI {

  entity = 'workflows';

  unsupportedMethods = ['post', 'patch', 'delete'];

  put(id, body) {
    if (!body) {
      body = id;
      id = '';
    }
    return super.put(id || '', body, 'json');
  }

  library() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + 'library/*')
        .accept('json')
        .end((err, res) => {
          if (err) {
            this.http.get(this.url + 'library')
              .accept('json')
              .end((err, res) => {
                if (err) { return reject(err); }
                resolve(res && res.body);
              });
          }
          else {
            resolve(res && res.body);
          }
        });
    });
  }

}
