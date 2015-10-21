// Copyright 2015, EMC, Inc.

'use strict';

import React from 'react';
import { render } from 'react-dom';
import Router, { Route, IndexRoute } from 'react-router';
import onReady from 'common-web-ui/lib/onReady';

import { MenuItem } from 'material-ui';
import NotFound from 'common-web-ui/views/NotFound';

// See http://material-ui.com/#/components/left-nav
export var navigation = [
  { text: 'OnRack API', type: MenuItem.Types.LINK, payload: 'https://' + window.location.hostname + '/rest/v1/api.html', target: '_blank' },
  { text: 'OnRack Dashboard', route: '' },
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
  <Route path="/" name="root" component={App}>
    <IndexRoute component={OnRackUserLogin} />
    <Route path="/chassis" component={ChassisCollection} />
    <Route path="/chassis/:chassisId" component={ChassisDetails} />
    {/*<Route path="/systems" component={SystemsCollection} />
    <Route path="/systems/:systemId" component={SystemDetails} />*/}
    <Route path="/dash" component={Dashboard} />
    <Route path="/login" component={OnRackUserLogin} />
    <Route name="*" component={NotFound}/>
  </Route>
);

// Run the application when both DOM is ready and page content is loaded
onReady(() => {
  if (global.isTesting) { return; }
  let container = document.createElement('div');
  container.className = 'react-container';
  document.body.appendChild(container);
  render(<Router>{routes}</Router>, container);
});
