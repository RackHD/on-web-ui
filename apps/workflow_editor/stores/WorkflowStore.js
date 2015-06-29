'use strict';

import Store from 'common-web-ui/lib/Store';

import WorkflowAPI from '../messengers/WorkflowAPI';

export default class WorkflowStore extends Store {

  list() {
    this.empty();
    return WorkflowAPI.getWorkflows()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return WorkflowAPI.getWorkflow(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return WorkflowAPI.postWorkflow(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return WorkflowAPI.patchWorkflow(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return WorkflowAPI.deleteWorkflow(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
