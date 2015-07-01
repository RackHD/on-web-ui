'use strict';

import Store from 'common-web-ui/lib/Store';

import TaskRestAPI from '../messengers/TasksRestAPI';

export default class TaskStore extends Store {

  list() {
    this.empty();
    return TaskRestAPI.getTasks()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return TaskRestAPI.getTask(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return TaskRestAPI.postTask(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return TaskRestAPI.patchTask(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return TaskRestAPI.deleteTask(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
