'use strict';

import Breadcrumbs from '../Breadcrumbs';

export default {

  isRouteHandler() { return !!this.props.params; },

  renderBreadcrumbs(...path) {
    return this.isRouteHandler() ? <Breadcrumbs path={path} /> : null;
  }

};
