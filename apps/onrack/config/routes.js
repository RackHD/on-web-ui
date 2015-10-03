// Copyright 2015, EMC, Inc.

'use strict';

import React from 'react';
import Router, { Route, /*Redirect,*/ NotFoundRoute, DefaultRoute } from 'react-router';
import onReady from 'common-web-ui/lib/onReady';

import { MenuItem } from 'material-ui';
import NotFound from 'common-web-ui/views/NotFound';

// See http://material-ui.com/#/components/left-nav
export var navigation = [
  { text: 'OnRack API', type: MenuItem.Types.LINK, payload: 'https://' + window.location.hostname + '/rest/v1/api.html', target: '_blank' },
  { text: 'OnRack Dashboard', route: 'dash' },
  { text: 'Resources', type: MenuItem.Types.SUBHEADER },
  { text: 'Chassis', route: 'chassis' },
  // { text: 'Systems', route: 'systems' },
  { text: 'Other', type: MenuItem.Types.SUBHEADER },
  { text: 'MonoRail API', type: MenuItem.Types.LINK, payload: '/docs', target: '_blank' },
  { text: 'MonoRail Dashboard', type: MenuItem.Types.LINK, payload: '/monorail', target: '_blank' },
  { text: 'Workflow Editor', type: MenuItem.Types.LINK, payload: '/workflow_editor', target: '_blank' },
  { text: '', type: MenuItem.Types.SUBHEADER },
  { text: ['© 2015 EMC', <sup>2</sup>], type: MenuItem.Types.LINK, payload: 'http://emc.com', target: '_blank' }
];

// Must be imported after navigation.
import App from '../views/App';

import ChassisCollection from '../views/ChassisCollection';
import ChassisDetails from '../views/ChassisDetails';
import Dashboard from '../views/Dashboard';
import OnRackUserLogin from '../views/OnRackUserLogin';
import SystemDetails from '../views/SystemDetails';
import SystemsCollection from '../views/SystemsCollection';

// See http://rackt.github.io/react-router/
let routes = (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute handler={OnRackUserLogin} />
    <Route name="chassis" handler={ChassisCollection} />
    <Route name="case" path="/chassis/:chassisId" handler={ChassisDetails} />
    {/*<Route name="systems" handler={SystemsCollection} />
    <Route name="system" path="/systems/:systemId" handler={SystemDetails} />*/}
    <Route name="dash" handler={Dashboard} />
    <Route name="login" handler={OnRackUserLogin} />
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

// Router configuration
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
