'use strict';

import 'babel/polyfill';

import appRoutes from './components/App/appRoutes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import Router from 'react-router';

// Needed for React Developer Tools
window.React = React;

// for react-chartist
console.err = function () {};

injectTapEventPlugin();

// Run the application when both DOM is ready and page content is loaded
new Promise((resolve) => {

  if (window.addEventListener)
    { window.addEventListener('DOMContentLoaded', resolve); }

  else { window.attachEvent('onload', resolve); }

}).then(() => {

  Router.
    create({
      routes: appRoutes,
      scrollBehavior: Router.ScrollToTopBehavior
    }).
    run(Handler => React.render(<Handler />, document.body));

}).catch(err => console.error(err));
