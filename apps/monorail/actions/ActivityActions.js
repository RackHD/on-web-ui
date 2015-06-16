'use strict';

import ActivityStore from '../stores/ActivityStore';

const activities = new ActivityStore();

export default {

  activities,

  add5() {
    setTimeout(function () {
      activities.insert(5, {id: 5, status: 'IDK'});
    }, 5000);
  }

};
