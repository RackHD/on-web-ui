// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorate from '../lib/decorate';
/* eslint-enable no-unused-vars */

@decorate({
  propTypes: {
    rows: PropTypes.array,
    mapper: PropTypes.func
  },
  defaultProps: {
    rows: [],
    mapper: item => <div>{JSON.stringify(item)}</div>
  }
})
export default class Console extends Component {

  static colors = {
    emerge: 'red',
    alert: 'yellow',
    crit: 'red',
    error: 'red',
    warning: 'red',
    notice: 'yellow',
    info: 'green',
    debug: 'blue',
    silly: 'blue'
  };

  state = {
    rows: this.props.rows.slice(0)
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.rows && nextProps.rows !== this.state.rows) {
      this.setState({rows: nextProps.rows});
    }
  }

  addRows(rows) {
    var offset = this.state.rows.length;
    this.setState(state => ({rows: state.rows.concat(rows)}));
  }

  render() {
    if (!this.state.rows || !this.state.rows.length) {
      return null;
    }
    return (
      <div className="Console" style={{
        background: 'black',
        padding: 5,
        borderRadius: 5
      }}>
        <span style={{color: 'white'}}>Console:</span>
        <div className="Console-logs" style={{
          padding: 5,
          maxHeight: 600,
          minHeight: 60,
          overflow: 'auto'
        }}>
          {this.state.rows.map(this.props.mapper)}
        </div>
      </div>
    );
  }

}
