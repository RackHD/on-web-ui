// Copyright 2015, EMC, Inc.

'use strict';

import Store from 'common-web-ui/lib/Store';

import FilesRestAPI from '../messengers/FilesRestAPI';

export default class NodeStore extends Store {

  filesRestAPI = new FilesRestAPI();

  key = 'uuid';

  list() {
    return this.filesRestAPI.list()
      .then(list => this.recollect(list))
      .catch(err => this.error(null, err));
  }

  read(filename) {
    return this.filesRestAPI.get(filename)
      .then(item => { this.assign(filename, {body: item}) })
      .catch(err => this.error(filename, err));
  }

  create(filename, data) {
    return this.filesRestAPI.put(filename, data)
      .then(() => this.insert(filename, data))
      .catch(err => this.error(filename, err));
  }

  update(filename, data) {
    return this.filesRestAPI.put(filename, data)
      .then(() => this.change(filename, data))
      .catch(err => this.error(filename, err));
  }

  destroy(uuid, filename=uuid) {
    return this.filesRestAPI.delete(uuid)
      .then(() => this.remove(filename))
      .catch(err => this.error(filename, err));
  }

}
