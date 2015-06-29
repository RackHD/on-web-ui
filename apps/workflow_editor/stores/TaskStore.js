'use strict';

import Store from 'common-web-ui/lib/Store';

import TaskAPI from '../messengers/TaskAPI';

export default class TaskStore extends Store {

  list() {
    this.empty();
    return TaskAPI.getTasks()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return TaskAPI.getTask(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return TaskAPI.postTask(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return TaskAPI.patchTask(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return TaskAPI.deleteTask(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
