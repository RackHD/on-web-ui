'use strict';

// NOTE: delay is added to give material-ui a chance to show off its fancy-ness.
const delay = 100;

export default {

  routePath: (...path) => '#/' + path.join('/'),

  routeTo: function (...path) {
    setTimeout(() => window.location = this.routePath(...path), delay);
  },

  routeBack: () => setTimeout(window.history.back.bind(window.history), delay)

};
