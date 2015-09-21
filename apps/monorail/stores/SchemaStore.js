'use strict';

import Store from 'common-web-ui/lib/Store';

import SchemasRestAPI from '../messengers/SchemasRestAPI';

export default class SchemaStore extends Store {

  schemasRestAPI =  new SchemasRestAPI();

  read(id) {
    return this.schemasRestAPI.get(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  list() {
    return this.schemasRestAPI.list()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

}
