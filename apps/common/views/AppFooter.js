// Copyright 2015, EMC, Inc.

'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';
import radium from 'radium';
import decorate from '../lib/decorate';

import ViewportSize from './ViewportSize';

@radium
@decorate({
  propTypes: {
    children: PropTypes.any,
    className: PropTypes.string,
    style: PropTypes.any
  },

  defaultProps: {
    children: [
      <span key={0}>© 2015 EMC<sup>2</sup></span>,
      <ViewportSize key={1} className="right" />
    ],
    className: '',
    style: []
  }
})
export default class AppFooter extends Component {

  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }

}
