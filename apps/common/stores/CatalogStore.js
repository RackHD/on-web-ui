// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'rui-common/lib/Store';

import RackHDRestAPIv1_1 from '../messengers/RackHDRestAPIv1_1';

export default class CatalogStore extends Store {

  api = RackHDRestAPIv1_1.url;
  resource = 'catalogs';

  read(id) {
    return RackHDRestAPIv1_1.catalogs.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  list() {
    return RackHDRestAPIv1_1.catalogs.list()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  listNode(nodeId) {
    this.empty();
    return RackHDRestAPIv1_1.nodes.listCatalogs(nodeId)
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  listNodeSource(nodeId, source) {
    this.empty();
    return RackHDRestAPIv1_1.nodes.listSourceCatalogs(nodeId, source)
      .then(items => Array.isArray(items) ? this.collect(items) : this.change(items.id, items))
      .catch(err => this.error(null, err));
  }

  relateNode(node, source, nodeStore) {
    return RackHDRestAPIv1_1.nodes.listSourceCatalogs(node.id, source)
      .then(catalog => {
        this.change(catalog.id, catalog);
        node[source] = catalog || node[source];
        if (nodeStore) {
          nodeStore.change(node.id, node);
        }
      })
      .catch(err => this.error(null, err));
  }

}
