'use strict';

import 'babel/polyfill';

import App from './components/App';
import AppActions from './actions/AppActions';
import FastClick from 'fastclick';
import React from 'react/addons';

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
  let element = React.createElement(App, {});
  React.render(element, document.body);
}
