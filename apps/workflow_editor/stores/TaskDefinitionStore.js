// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import TasksRestAPI from '../messengers/TasksRestAPI';

export default class TaskDefinitionStore extends Store {

  tasksRestAPI = new TasksRestAPI();
  autoCache = true;

  list() {
    this.empty();
    return this.tasksRestAPI.list()
      .then(list => this.collect(list.map(item => {
        item.id = item.injectableName;
        return item;
      })))
      .catch(err => this.error(null, err));
  }

}
