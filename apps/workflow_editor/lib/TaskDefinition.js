// Copyright 2015, EMC, Inc.

'use strict';

import merge from 'lodash/object/merge';

import TaskNode from './TaskNode';

export default class TaskDefinition {

  constructor(data) { merge(this, data); }

  toTaskNode(editor, label, ignoreFailure) {
    return new TaskNode(editor, this, { label, ignoreFailure });
  }

}
