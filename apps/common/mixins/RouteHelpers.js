// Copyright 2015, EMC, Inc.

'use strict';

// NOTE: delay is added to give material-ui a chance to show off its fancy-ness.
const delay = 100;

export default {

  isActive() { /* TODO */ },

  routePath: (...path) => '#/' + path.join('/'),

  routeTo(...path) {
    setTimeout(() => window.location = this.routePath(...path), delay);
  },

  routeBack: () => setTimeout(window.history.back.bind(window.history), delay)

};
