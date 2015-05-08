'use strict';

import Store from '../lib/Store';

import WorkflowAPI from '../api/WorkflowAPI';

class WorkflowStore extends Store {

  fetch() {
    this.empty();
    WorkflowAPI.getWorkflows()
      .then(nodes => this.collect(nodes))
      .catch(err => console.error(err));
  }

}

export default new WorkflowStore();
