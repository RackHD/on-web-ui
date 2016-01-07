// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import MonoRailRestAPIv1_1 from '../messengers/MonoRailRestAPIv1_1';

export default class WorkflowTemplateStore extends Store {

  api = MonoRailRestAPIv1_1.url;
  resource = 'graphDefs';

  key = 'injectableName';

  list() {
    return MonoRailRestAPIv1_1.workflows.library()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return MonoRailRestAPIv1_1.workflows.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return MonoRailRestAPIv1_1.workflows.put(data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

}
