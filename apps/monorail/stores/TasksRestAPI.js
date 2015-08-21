'use strict';

import Store from 'common-web-ui/lib/Store';

import TasksRestAPI from '../messengers/TasksRestAPI';

export default class TasksStore extends Store {

  tasksRestAPI =  new TasksRestAPI();

  read(id) {
    return this.tasksRestAPI.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  list() {
    this.empty();
    return this.tasksRestAPI.list()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

}
