// Copyright 2015, EMC, Inc.

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
    warning: 'yellow',
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
        <b>{props.timestamp}</b>&nbsp;&nbsp;
        {/*<i>[{props.name}]</i>&nbsp;&nbsp;
        <i>[{props.module}]</i>&nbsp;&nbsp;
        <i>[{props.subject}]</i>&nbsp;&nbsp;*/}
        <b>{props.message}</b>&nbsp;&nbsp;
        {/*<u>{props.caller}</u>&nbsp;&nbsp;*/}
      </div>
    );
  }

}
