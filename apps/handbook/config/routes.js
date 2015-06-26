'use strict';

import React from 'react';
import Router, { Route, Redirect, NotFoundRoute, DefaultRoute } from 'react-router';
import onReady from 'common-web-ui/lib/onReady';

import NotFound from 'common-web-ui/views/NotFound';
import { MenuItem } from 'material-ui';

export var navigation = [
  { text: 'Home', route: '/' },

  { text: 'Guides', type: MenuItem.Types.SUBHEADER },
  { text: 'Getting Started', route: '/guides/getting_started' },
  { text: 'Tutorial App', route: '/guides/tutorial_app' },
  { text: 'Testing', route: '/guides/testing' },
  { text: 'Scaffolding', route: '/guides/scaffolding' },
  { text: 'Code Style', route: '/guides/code_style' },

  { text: 'Technologies', type: MenuItem.Types.SUBHEADER },
  { text: 'React', type: MenuItem.Types.LINK,
    payload: 'https://facebook.github.io/react/docs/getting-started.html' },
  { text: 'Radium', type: MenuItem.Types.LINK,
    payload: 'http://projects.formidablelabs.com/radium/' },
  { text: 'Material UI', type: MenuItem.Types.LINK,
    payload: 'http://material-ui.com/#/components/appbar' },
  { text: 'BabelJS', type: MenuItem.Types.LINK,
    payload: 'http://babeljs.io/docs/learn-es2015/#ecmascript-6-features' },
  { text: 'webpack', type: MenuItem.Types.LINK,
    payload: 'http://webpack.github.io/' },
  { text: 'Gulp', type: MenuItem.Types.LINK,
    payload: 'http://gulpjs.com/' },
  { text: 'Slush', type: MenuItem.Types.LINK,
    payload: 'http://slushjs.github.io/' },
  { text: 'Karma', type: MenuItem.Types.LINK,
    payload: 'http://karma-runner.github.io/' },
  { text: 'BrowserSync', type: MenuItem.Types.LINK,
    payload: 'http://www.browsersync.io/' }
];

import App from '../views/App';
import HomePage from '../views/HomePage';
import GuideViewerPage from '../views/GuideViewerPage';

let routes = (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute handler={HomePage} />
    <Redirect from="home" to="/" />
    <Route path="/docs/:doc" handler={HomePage} />
    <Route path="/guides/:guide" handler={GuideViewerPage} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);

let params = {
  routes,
  scrollBehavior: Router.ScrollToTopBehavior
};

// Run the application when both DOM is ready and page content is loaded
onReady(() => {
  if (global.isTesting) { return; }
  Router.create(params).run(Handler => {
    React.render(<Handler />, document.body);
  });
});
