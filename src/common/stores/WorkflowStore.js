// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv1_1 from '../messengers/RackHDRestAPIv1_1';

export default class WorkflowStore extends Store {

  api = RackHDRestAPIv1_1.url;
  resource = 'graphObjs';

  key = 'instanceId';

  static getNodeId(workflow) {
    return this.prototype.getNodeId(workflow);
  }

  getNodeId(workflow={}) {
    return workflow.node || (workflow.definition &&
      workflow.definition.options && (
      workflow.definition.options.nodeId ||
      workflow.definition.options.defaults &&
      workflow.definition.options.defaults.nodeId));
  }

  list() {
    return RackHDRestAPIv1_1.workflows.list()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return RackHDRestAPIv1_1.workflows.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return RackHDRestAPIv1_1.workflows.put(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return RackHDRestAPIv1_1.workflows.put(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  listNode(nodeId) {
    this.empty();
    return RackHDRestAPIv1_1.nodes.listWorkflows(nodeId)
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  activeNode(nodeId) {
    this.empty();
    return RackHDRestAPIv1_1.nodes.getActiveWorkflow(nodeId)
      .then(items => Array.isArray(items) ? this.collect(items) : this.change(items.id, items))
      .catch(err => this.error(null, err));
  }

}
