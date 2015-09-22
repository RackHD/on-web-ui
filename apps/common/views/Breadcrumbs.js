// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorate from '../lib/decorate';
/* eslint-enable no-unused-vars */

@decorate({
  propTypes: {
    path: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          prefix: PropTypes.string,
          href: PropTypes.string
        })
      ]))
    ])
  },
  defaultProps: {
    path: []
  }
})
export default class Breadcrumbs extends Component {

  renderPath() {
    if (this.path) { return this.path; }
    if (!this.props.path) {
      return 'Unable to render breadcrumbs path.';
    }
    this.path = [];
    this.props.path.forEach((route, index) => {
      if (!route) {
        console.warn(new Error('Missing route in breadcrumbs.').stack);
        return;
      }
      if (typeof route === 'string') { route = {label: route}; }
      var { prefix = '#/', label, href } = route;
      if (href) {
        href = prefix + href;
        route = <a href={href} key={'item-' + index}>{label}</a>;
      }
      else {
        route = <b key={'item-' + index}>{label}</b>;
      }
      this.path.push(route);
      this.path.push(<span key={'divider-' + index}>&nbsp;/&nbsp;</span>);
    });
    this.path.pop();
    return this.path;
  }

  render() {
    var styles = {
      paddingTop: 10,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 10,
      marginBottom: 0,
      background: '#ccc'
    };
    return (
      <div className="Breadcrumbs" style={styles}>
        {this.renderPath()}
      </div>
    );
  }

}
