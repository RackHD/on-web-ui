'use strict';

import Store from 'common-web-ui/lib/Store';

import CatalogsRestAPI from '../messengers/CatalogsRestAPI';
import NodesRestAPI from '../messengers/NodesRestAPI';

export default class CatalogStore extends Store {

  catalogsRestAPI =  new CatalogsRestAPI();
  nodesRestAPI = new NodesRestAPI();

  read(id) {
    return this.catalogsRestAPI.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  list() {
    return this.catalogsRestAPI.list()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  listNode(nodeId) {
    this.empty();
    return this.nodesRestAPI.listCatalogs(nodeId)
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  listNodeSource(nodeId, source) {
    this.empty();
    return this.nodesRestAPI.listSourceCatalogs(nodeId, source)
      .then(items => Array.isArray(items) ? this.collect(items) : this.change(items.id, items))
      .catch(err => this.error(null, err));
  }

}
