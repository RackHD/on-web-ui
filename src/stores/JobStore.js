'use strict';

import Store from '../lib/Store';

import JobAPI from '../api/JobAPI';

export default class JobStore extends Store {

  list() {
    this.empty();
    return JobAPI.getJobs()
      .then(list => this.collect(list))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return JobAPI.getJob(id)
      .then(item => this.change(id, item))
      .catch(err => this.error(id, err));
  }

  // create(id, data) {
  //   return JobAPI.postJob(id, data)
  //     .then(() => this.insert(id, data))
  //     .catch(err => this.error(id, err));
  // }

  // update(id, data) {
  //   return JobAPI.patchJob(id, data)
  //     .then(() => this.change(id, data))
  //     .catch(err => this.error(id, err));
  // }

  // destroy(id) {
  //   return JobAPI.deleteJob(id)
  //     .then(() => this.remove(id))
  //     .catch(err => this.error(id, err));
  // }

}
