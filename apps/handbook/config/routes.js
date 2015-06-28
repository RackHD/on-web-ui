'use strict';

import React from 'react';
import Router, { Route, NotFoundRoute, DefaultRoute } from 'react-router';
import onReady from 'common-web-ui/lib/onReady';

import NotFound from 'common-web-ui/views/NotFound';
import { MenuItem } from 'material-ui';

export var navigation = [
  { text: 'API Documentation', route: '/docs' },
  { text: 'Project Guide', route: '/guides' },

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
import DocViewerPage from '../views/DocViewerPage';
import GuideViewerPage from '../views/GuideViewerPage';

let routes = (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute handler={GuideViewerPage} />
    <Route path="/docs" handler={DocViewerPage} />
    <Route path="/docs/:doc" handler={DocViewerPage} />
    <Route path="/guides" handler={GuideViewerPage} />
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
