'use strict';

import Store from '../lib/Store';

import ActivityAPI from '../api/ActivityAPI';

export default class ActivityStore extends Store {

  list() {
    this.empty();
    return ActivityAPI.getActivities()
      .then(activities => this.collect(activities))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return ActivityAPI.getActivity(id)
      .then(activity => this.change(id, activity))
      .catch(err => this.error(id, err));
  }

  create(id, data) {
    return ActivityAPI.postActivities(id, data)
      .then(() => this.insert(id, data))
      .catch(err => this.error(id, err));
  }

  update(id, data) {
    return ActivityAPI.patchActivity(id, data)
      .then(() => this.change(id, data))
      .catch(err => this.error(id, err));
  }

  destroy(id) {
    return ActivityAPI.deleteActivity(id)
      .then(() => this.remove(id))
      .catch(err => this.error(id, err));
  }

}
