// Copyright 2015, EMC, Inc.

'use strict';

import TaskDefinitionStore from 'monorail-web-ui/stores/TaskDefinitionStore';

export default class TaskDefinitionStore2 extends TaskDefinitionStore {

  autoCache = true;

  static cache = {};

  list() {
    this.empty();
    return super.list();
  }

}
