'use strict';

import featureFlag from '../lib/featureFlag';

const devFlag = featureFlag('dev');

export default {

  profileTime(name, stage) {
    if (!devFlag.check()) { return; }
    this._timeProfiles = this._timeProfiles || {};
    this._timeProfiles[name] = this._timeProfiles[name] || {};
    var timeProfile = this._timeProfiles[name];
    if (!timeProfile.start) {
      timeProfile.start = Date.now();
      timeProfile.stage = stage;
    }
    else {
      timeProfile.end = Date.now();
      console.info(JSON.stringify(name),
        'took:', timeProfile.end - timeProfile.start, 'ms',
        'from:', JSON.stringify(timeProfile.stage),
        'to:', JSON.stringify(stage));
      timeProfile.stage = stage;
      timeProfile.start = timeProfile.end;
      timeProfile.end = null;
    }
  }

};
