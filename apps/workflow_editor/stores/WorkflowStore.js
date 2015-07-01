'use strict';

import Store from 'common-web-ui/lib/Store';

import WorkflowsRestAPI from '../messengers/WorkflowsRestAPI';

export default class WorkflowStore extends Store {

  list() {
    this.empty();
    return WorkflowsRestAPI.getWorkflows()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return WorkflowsRestAPI.getWorkflow(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return WorkflowsRestAPI.postWorkflow(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return WorkflowsRestAPI.patchWorkflow(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return WorkflowsRestAPI.deleteWorkflow(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
