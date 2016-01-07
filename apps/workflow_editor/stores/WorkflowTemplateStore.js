// Copyright 2015, EMC, Inc.

'use strict';

import WorkflowTemplateStore from 'monorail-web-ui/stores/WorkflowTemplateStore';

export default class WorkflowTemplateStore2 extends WorkflowTemplateStore {

  autoCache = true;

  static cache = {};

  list() {
    this.empty();
    return super.list();
  }

}
