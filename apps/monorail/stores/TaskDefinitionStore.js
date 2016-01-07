// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import MonoRailRestAPIv1_1 from '../messengers/MonoRailRestAPIv1_1';

export default class TaskDefinitionStore extends Store {

  // api = MonoRailRestAPIv1_1.url;
  // resource = 'taskDefs';

  key = 'injectableName';

  list() {
    return MonoRailRestAPIv1_1.tasks.library()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

}
