'use strict';

import Store from 'common-web-ui/lib/Store';

import FilesRestAPI from '../messengers/FilesRestAPI';

export default class NodeStore extends Store {

  filesRestAPI = new FilesRestAPI();

  list() {
    this.empty();
    return this.filesRestAPI.list()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  read(filename) {
    return this.filesRestAPI.get(filename)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  create(filename, data) {
    return this.filesRestAPI.put(filename, data)
      .then(() => this.insert(filename, data))
      .catch(err => this.error(filename, err));
  }

  update(filename, data) {
    return this.filesRestAPI.put(filename, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(uuid, filename=uuid) {
    return this.filesRestAPI.delete(uuid)
      .then(() => this.remove(filename))
      .catch(err => this.error(filename, err));
  }

}
