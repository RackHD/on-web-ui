'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorate from '../lib/decorate';
/* eslint-enable no-unused-vars */

@decorate({
  propTypes: {},
  defaultProps: {}
})
export default class Console extends Component {

  state = {
    rows: []
  };

  addRows(rows) {
    var offset = this.state.rows.length;
    this.setState(state => ({
      rows: state.rows.concat(rows.map((row, i) => (
        <div key={'cr-' + (offset + i)} className="ConsoleRow">{row}</div>
      )))
    }));
  }

  render() {
    return (
      <div className="Console">
        {this.state.rows}
      </div>
    );
  }

}
