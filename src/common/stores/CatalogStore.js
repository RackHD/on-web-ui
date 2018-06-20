// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv2_0 from '../messengers/RackHDRestAPIv2_0';

export default class CatalogStore extends Store {

  api = RackHDRestAPIv2_0.url;
  resource = 'catalogs';

  read(id) {
    return RackHDRestAPIv2_0.api.catalogsIdGet({identifier: id})
      .then(res => {
        console.log(res.obj);
        this.change(id, res.obj);
      })
      .catch(err => this.error(id, err));
  }

  list() {
    return RackHDRestAPIv2_0.api.catalogsGet()
      .then(res => this.collect(res.obj))
      .catch(err => this.error(null, err));
  }

  listNode(nodeId) {
    this.empty();
    return RackHDRestAPIv2_0.api.nodesGetCatalogById({identifier: nodeId})
      .then(res => this.collect(res.obj))
      .catch(err => this.error(null, err));
  }

  listNodeSource(nodeId, source) {
    this.empty();
    return RackHDRestAPIv2_0.api.nodesGetCatalogSourceById({identifier: nodeId, source })
      .then(res => {
        let items = res.obj;
        if (Array.isArray(items)) {
          this.collect(items);
        }
        else {
          this.change(items.id, items);
        }
      })
      .catch(err => this.error(null, err));
  }

  relateNode(node, source, nodeStore) {
    return RackHDRestAPIv2_0.api.nodesGetCatalogSourceById({identifier: node.id, source })
      .then(res => {
        let catalog = res.obj;
        this.change(catalog.id, catalog);
        node[source] = catalog || node[source];
        if (nodeStore) {
          nodeStore.change(node.id, node);
        }
      })
      .catch(err => this.error(null, err));
  }

}
