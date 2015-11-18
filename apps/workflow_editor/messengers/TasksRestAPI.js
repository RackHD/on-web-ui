// Copyright 2015, EMC, Inc.

'use strict';

import { MONORAIL_API } from 'monorail-web-ui/config/index';
import RestAPI from 'common-web-ui/lib/RestAPI';

export default class TasksRestAPI extends RestAPI {

  api = MONORAIL_API;
  entity = 'tasks';

  get workflowsUrl() { return this.getResourceUrl('workflows'); }

  list() {
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
