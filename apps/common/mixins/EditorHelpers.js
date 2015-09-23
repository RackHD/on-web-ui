// Copyright 2015, EMC, Inc.

// Copyright 2015, EMC, Inc.

'use strict';

export default {

  disable() { this.setState({disabled: true}); },

  enable() {
    setTimeout(() => this.setState({disabled: false}), 500);
  },

  linkObjectState(stateKey, key) {
    var obj = this.state[stateKey];
    return {
      value: obj && obj[key] || null,
      requestChange: (value) => {
        var change = {};
        if (obj) {
          obj[key] = value;
          change[stateKey] = obj;
        }
        else {
          change[stateKey] = {};
          change[stateKey][key] = value;
        }
        this.setState(change);
      }
    };
  }

};
