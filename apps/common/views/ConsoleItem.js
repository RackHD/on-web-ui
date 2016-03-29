// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

export default class ConsoleItem extends Component {

  static defaultProps = {
    height: 40,
    level: 'debug',
    timestamp: null,
    name: null,
    module: null,
    subject: null,
    message: null,
    caller: null
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

  render() {
    let { props } = this;

    return (
      <div style={{
        boxSizing: 'border-box',
        color: ConsoleItem.colors[props.level],
        borderTop: '1px dotted #888',
        padding: '5px 0',
        margin: 0,
        height: props.height
      }}>
        <b>{props.timestamp}</b>
        {/*<i>[{props.name}]</i>
        <i>[{props.module}]</i>
        <i>[{props.subject}]</i>*/}
        <b>{props.message}</b>
        {/*<u>{props.caller}</u>*/}
      </div>
    );
  }

}
