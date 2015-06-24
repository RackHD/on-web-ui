'use strict';

import React from 'react';
import Router, { Route, Redirect, NotFoundRoute, DefaultRoute } from 'react-router';
import onReady from 'common-web-ui/lib/onReady';

import NotFound from 'common-web-ui/views/NotFound';
import { MenuItem } from 'material-ui';

export var navigation = [
  { text: 'Home', route: '/' },

  { text: 'Guides', type: MenuItem.Types.SUBHEADER },
  { text: 'Getting Started', route: '/getting_started' },
  { text: 'Tutorial Application', route: '/tutorial_application' },
  { text: 'Testing Tutorial', route: '/testing_tutorial' },
  { text: 'Scaffolding', route: '/scaffolding' },
  { text: 'Material UI', type: MenuItem.Types.LINK,
    payload: 'http://material-ui.com/#/components/appbar' },
];

import App from '../views/App';
import HomePage from '../views/HomePage';
import GettingStartedPage from '../views/GettingStartedPage';
import ScaffoldingPage from '../views/ScaffoldingPage';
import TestingTutorialPage from '../views/TestingTutorialPage';
import TutorialApplicationPage from '../views/TutorialApplicationPage';

let routes = (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute handler={HomePage} />

    <Route path="/getting_started" handler={GettingStartedPage} />
    <Route path="/tutorial_application" handler={TutorialApplicationPage} />
    <Route path="/testing_tutorial" handler={TestingTutorialPage} />
    <Route path="/scaffolding" handler={ScaffoldingPage} />

    <NotFoundRoute handler={NotFound} />
    <Redirect from="home" to="/" />
  </Route>
);

let params = {
  routes,
  scrollBehavior: Router.ScrollToTopBehavior
};

// Run the application when both DOM is ready and page content is loaded
onReady(() =>
  Router.create(params).run(
    Handler => React.render(<Handler />, document.body)));
