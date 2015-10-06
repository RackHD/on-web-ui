// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import WorkflowsRestAPI from '../messengers/WorkflowsRestAPI';

export default class WorkflowTemplateStore extends Store {

  workflowsRestAPI = new WorkflowsRestAPI();

  api = this.workflowsRestAPI.api;
  resource = 'graphDefs';

  key = 'injectableName';

  list() {
    return this.workflowsRestAPI.library()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return this.workflowsRestAPI.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return this.workflowsRestAPI.put(data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

}
