// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv2_0 from '../messengers/RackHDRestAPIv2_0';

export default class WorkflowStore extends Store {

  api = RackHDRestAPIv2_0.url;
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

  list(params) {
    return RackHDRestAPIv2_0.api.workflowsGet(params)
      .then(res => this.recollect(res.obj))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return RackHDRestAPIv2_0.api.workflowsGetByInstanceId({identifier: id})
      .then(res => this.change(id, res.obj))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    data.id = id;
    return RackHDRestAPIv2_0.api.workflowsPost({body: data})
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  // update(id, data) {
  //   return RackHDRestAPIv2_0.api.put(id, data)
  //     .then(() => this.change(id, data))
  //     .catch(err => this.error(id, err));
  // }

  listNode(nodeId) {
    this.empty();
    return RackHDRestAPIv2_0.api.nodesGetWorkflowById({identifier: nodeId})
      .then(res => this.collect(res.obj))
      .catch(err => this.error(null, err));
  }

  activeNode(nodeId) {
    this.empty();
    return RackHDRestAPIv2_0.api.nodesGetWorkflowById({identifier: nodeId, active: true})
      .then(items => Array.isArray(items) ? this.collect(items) : this.change(items.id, items))
      .catch(err => this.error(null, err));
  }

}
