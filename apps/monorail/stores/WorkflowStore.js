'use strict';

import Store from 'common-web-ui/lib/Store';

import WorkflowsRestAPI from '../messengers/WorkflowsRestAPI';
import NodesRestAPI from '../messengers/NodesRestAPI';

export default class WorkflowStore extends Store {

  workflowsRestAPI = new WorkflowsRestAPI();
  nodesRestAPI = new NodesRestAPI();

  list() {
    this.empty();
    return this.workflowsRestAPI.list()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return this.workflowsRestAPI.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return this.workflowsRestAPI.put(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return this.workflowsRestAPI.put(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  listNode(nodeId) {
    this.empty();
    return this.nodesRestAPI.listWorkflows(nodeId)
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  activeNode(nodeId) {
    this.empty();
    return this.nodesRestAPI.getActiveWorkflow(nodeId)
      .then(items => Array.isArray(items) ? this.collect(items) : this.change(items.id, items))
      .catch(err => this.error(null, err));
  }

}
