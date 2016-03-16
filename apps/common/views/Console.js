// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

export default class Console extends Component {

  static defaultProps = {
    limit: 512,
    mapper: item => <div>{JSON.stringify(item)}</div>,
    offset: 0,
    rows: []
  };

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
    let { props } = this;

    let rows = this.state.rows || [];

    rows = rows.slice(props.offset, props.offset + props.limit);

    return (
      <div className="Console" style={{
        background: 'black',
        padding: 5,
        borderRadius: 5
      }}>
        <span style={{color: 'white'}}>Console:</span>
        <div className="Console-logs" style={{
          padding: 5,
          maxHeight: 800,
          minHeight: 20,
          height: this.props.height - 20,
          transition: 'height 1s',
          overflow: 'auto'
        }}>
          {rows.length ? rows.map(this.props.mapper) : '(empty)'}
        </div>
      </div>
    );
  }

}
