'use strict';

import merge from 'lodash/object/merge';

import WorkflowGraph from './WorkflowGraph';

export default class Workflow {

  constructor(data) { merge(this, data); }

  toWorkflowGraph(editor) {
    return new WorkflowGraph(editor, this);
  }

}
