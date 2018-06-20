// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv2_0 from '../messengers/RackHDRestAPIv2_0';

export default class TaskDefinitionStore extends Store {

  // api = RackHDRestAPIv1_1.url;
  // resource = 'taskDefs';

  key = 'injectableName';

  list() {
    return RackHDRestAPIv2_0.api.workflowsGetAllTasks()
      .then(res => this.recollect(res.obj))
      .catch(err => this.error(null, err));
  }

}
