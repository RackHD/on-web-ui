'use strict';

// NOTE: delay is added to give material-ui a chance to show off its fancy-ness.
const delay = 100;

export default {

  routePath: function (path) {
    if (arguments.length > 1) {
      path = Array.prototype.slice.call(arguments, 0);
    }
    if (Array.isArray(path)) {
      path = path.join('/');
    }
    return '#/' + path;
  },

  routeTo: function () {
    var args = arguments;
    setTimeout(function () {
      window.location = this.routePath.apply(this, args);
    }.bind(this), delay);
  },

  routeBack: () => setTimeout(window.history.back.bind(window.history), delay)

};
