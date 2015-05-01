'use strict';

import 'babel/polyfill';

import AppActions from './actions/AppActions';
import AppComponent from './components/App';
// import AppRoutes from './components/App/Routes';
import FastClick from 'fastclick';
import React from 'react';
import ReactAddons from 'react/addons';
// import Router from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

//Needed for React Developer Tools
window.React = React;

injectTapEventPlugin();

// let path = decodeURI(window.location.pathname);

// Run the application when both DOM is ready
// and page content is loaded
Promise.all([
  new Promise((resolve) => {
    if (window.addEventListener) {
      window.addEventListener('DOMContentLoaded', resolve);
    }

    else {
      window.attachEvent('onload', resolve);
    }
  }).then(() => FastClick.attach(document.body)),

  new Promise((resolve, reject) => AppActions.loadPage().then(resolve).catch(reject))
]).then(run).catch(function (err) { throw err; });

function run() {
  // Render the top-level React component
  let element = ReactAddons.createElement(AppComponent, {});
  ReactAddons.render(element, document.body);
  // Router.
  //   create({
  //     routes: AppRoutes,
  //     scrollBehavior: Router.ScrollToTopBehavior
  //   }).
  //   run(Handler => React.render(<Handler/>, document.body));
}
