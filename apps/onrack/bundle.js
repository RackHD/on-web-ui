'use strict';

import 'babel/polyfill';

import './config';

import appRoutes from './views/App/appRoutes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import Router from 'react-router';
import onReady from 'common-web-ui/lib/onReady';

// Needed for React Developer Tools
window.React = React;

// for react-chartist
console.err = function () {};

injectTapEventPlugin();

// Run the application when both DOM is ready and page content is loaded
onReady(() => {

  Router.
    create({
      routes: appRoutes,
      scrollBehavior: Router.ScrollToTopBehavior
    }).
    run(Handler => React.render(<Handler />, document.body));

});
