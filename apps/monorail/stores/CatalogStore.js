// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import MonoRailRestAPIv1_1 from '../messengers/MonoRailRestAPIv1_1';

export default class CatalogStore extends Store {

  api = MonoRailRestAPIv1_1.url;
  resource = 'catalogs';

  read(id) {
    return MonoRailRestAPIv1_1.catalogs.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  list() {
    return MonoRailRestAPIv1_1.catalogs.list()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  listNode(nodeId) {
    this.empty();
    return MonoRailRestAPIv1_1.nodes.listCatalogs(nodeId)
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  listNodeSource(nodeId, source) {
    this.empty();
    return MonoRailRestAPIv1_1.nodes.listSourceCatalogs(nodeId, source)
      .then(items => Array.isArray(items) ? this.collect(items) : this.change(items.id, items))
      .catch(err => this.error(null, err));
  }

}
