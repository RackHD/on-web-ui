'use strict';

import Store from 'common-web-ui/lib/Store';

import WorkflowsRestAPI from '../messengers/WorkflowsRestAPI';

export default class WorkflowTemplateStore extends Store {

  workflowsRestAPI = new WorkflowsRestAPI();

  list() {
    this.empty();
    return this.workflowsRestAPI.library()
      .then(list => this.collect(list.map(item => {
        item.id = item.injectableName;
        return item;
      })))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return this.workflowsRestAPI.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return this.workflowsRestAPI.put(data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

}
