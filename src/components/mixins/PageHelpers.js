'use strict';

import Breadcrumbs from '../Breadcrumbs';

export default {

  isRouteHandler: function () { return !!this.props.params; },

  renderBreadcrumbs: function (...path) {
    return this.isRouteHandler() ? <Breadcrumbs path={path} /> : null;
  }

};
