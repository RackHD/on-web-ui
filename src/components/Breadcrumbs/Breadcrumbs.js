'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import './Breadcrumbs.less';

export default class Breadcrumbs extends Component {

  renderPath() {
    if (this.path) { return this.path; }
    if (!this.props.path) {
      return 'Unable to render breadcrumbs path.';
    }
    this.path = [];
    this.props.path.forEach(route => {
      if (typeof route === 'string') { route = {label: route}; }
      var prefix = route.prefix || '#/',
          label = route.label,
          href = route.href;
      if (href) {
        href = prefix + href;
        route = <a href={href}>{label}</a>;
      }
      else {
        route = <b>{label}</b>;
      }
      this.path.push(route);
      this.path.push(<span>&nbsp;/&nbsp;</span>);
    });
    this.path.pop();
    return this.path;
  }

  render() {
    var path = this.renderPath();
    return <div className="Breadcrumbs">{path}</div>;
  }

}
