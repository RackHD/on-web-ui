'use strict';

export default {

  disable: function () { this.setState({disabled: true}); },

  enable: function () {
    setTimeout(() => this.setState({disabled: false}), 500);
  },

  linkObjectState: function (stateKey, key) {
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
