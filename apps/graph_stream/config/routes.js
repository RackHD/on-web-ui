'use strict';

import page from 'page';
import React from 'mach-react';
import onReady from 'common-web-ui/lib/onReady';

import Home from '../views/Home';

let current = null;
function render(Component, props, context) {
  return function (pageContext, next) {
    if (current) { current.unmount(); }
    current = new Component(props, context);
    current.mergeObjectProperty('props', {
      params: pageContext.params
    });
    current.mount(document.body);
    if (next) { next(); }
  }
}

// Run the application when both DOM is ready and page content is loaded
onReady(() => {
  let context = {};
  page('/', render(Home, {}, context));
  page('*', render(Home, {}, context));
  page();
});
