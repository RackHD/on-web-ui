// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv2_0 from '../messengers/RackHDRestAPIv2_0';

export default class WorkflowTemplateStore extends Store {

  api = RackHDRestAPIv2_0.url;
  resource = 'graphDefs';

  key = 'injectableName';

  list() {
    return RackHDRestAPIv2_0.api.workflowsGetGraphs()
      .then(res => this.recollect(res.obj))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return RackHDRestAPIv2_0.api.workflowsGetGraphsByName({injectableName: id})
      .then(res => this.change(id, res.obj))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return RackHDRestAPIv2_0.api.workflowsPutGraphs({body: data})
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  // TODO: add patch and delete :)

}
