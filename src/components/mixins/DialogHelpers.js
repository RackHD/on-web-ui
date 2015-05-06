'use strict';

export default {

  confirmDialog: function (message, callback) {
    // TODO: do not use prompt
    var confirmed = window.confirm(message); // eslint-disable-line no-alert
    callback(confirmed);
  }

};
