// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'rui-common/lib/Store';

import RackHDRestAPIv1_1 from '../messengers/RackHDRestAPIv1_1';

export default class TaskDefinitionStore extends Store {

  // api = RackHDRestAPIv1_1.url;
  // resource = 'taskDefs';

  key = 'injectableName';

  list() {
    return RackHDRestAPIv1_1.tasks.library()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

}
