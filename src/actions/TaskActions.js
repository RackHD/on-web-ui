'use strict';

import TaskStore from '../stores/TaskStore';

export const tasks = new TaskStore();

export default {

  fetch() {
    return tasks.fetch();
  }

};
