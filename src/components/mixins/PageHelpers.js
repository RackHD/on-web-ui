'use strict';

import Breadcrumbs from '../Breadcrumbs';

export default {

  isRouteHandler: function () { return !!this.props.params; },

  renderBreadcrumbs: function (path) {
    if (arguments.length > 1) { path = Array.prototype.slice.call(arguments, 0 ); }
    return this.isRouteHandler() ? <Breadcrumbs path={path} /> : null;
  }

};
