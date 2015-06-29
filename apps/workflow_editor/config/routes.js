'use strict';

import React from 'react';
import Router, { Route, Redirect, NotFoundRoute, DefaultRoute } from 'react-router';
import onReady from 'common-web-ui/lib/onReady';

// import { MenuItem } from 'material-ui';
import NotFound from 'common-web-ui/views/NotFound';

// See http://material-ui.com/#/components/left-nav
export var navigation = [
  { text: 'Worfklow Editor', route: '/' },
  { text: 'Not Found', route: '404' }
];

// Must be imported after navigation.
import App from '../views/App';
import WorkflowEditor from '../views/WorkflowEditor';

// See http://rackt.github.io/react-router/
let routes = (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute handler={WorkflowEditor} />
    <NotFoundRoute handler={NotFound} />
    <Redirect from="editor" to="/" />
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
