'use strict';

import Breadcrumbs from '../components/Breadcrumbs';

export default {

  isRouteHandler() { return !!this.props.params; },

  renderBreadcrumbs(...path) {
    return this.isRouteHandler() ? <Breadcrumbs path={path} /> : null;
  }

};
