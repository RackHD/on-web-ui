// Copyright 2015, EMC, Inc.

'use strict';

import Breadcrumbs from '../views/Breadcrumbs';

export default {

  isRouteHandler() { return !!this.props.params; },

  renderBreadcrumbs(...path) {
    return this.isRouteHandler() ? <Breadcrumbs path={path} /> : null;
  }

};
