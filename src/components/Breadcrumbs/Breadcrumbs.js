'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import './Breadcrumbs.less';

export default class Breadcrumbs extends Component {

  render() {
    return (
      <div className="Breadcrumbs">
        {this.props.children}
      </div>
    );
  }

}
