'use strict';

import WorkflowStore from '../stores/WorkflowStore';

export const workflows = new WorkflowStore();

export default {

  fetch() {
    return workflows.fetch();
  }

};
