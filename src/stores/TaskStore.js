'use strict';

import Store from '../lib/Store';

import TaskAPI from '../api/TaskAPI';

export default class TaskStore extends Store {

  fetch() {
    this.empty();
    return TaskAPI.getTasks()
      .then(tasks => this.collect(tasks))
      .catch(err => console.error(err));
  }

}
