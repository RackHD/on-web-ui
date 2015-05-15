'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import { Route, Redirect, NotFoundRoute, DefaultRoute } from 'react-router';

import App from './App';
import { ChassisCollection, ChassisDetails } from '../Chassis';
import { SystemsCollection, SystemDetails } from '../Systems';
import Dashboard from '../Dashboard';
import NotFound from '../../../../common/components/NotFound';

export default (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute handler={Dashboard}/>

    <Route name="chassis" handler={ChassisCollection} />
    <Route name="case" path="/chassis/:chassisId" handler={ChassisDetails} />

    <Route name="systems" handler={SystemsCollection} />
    <Route name="system" path="/systems/:systemId" handler={SystemDetails} />

    <NotFoundRoute handler={NotFound}/>
    <Redirect from="dash" to="/" />
  </Route>
);
