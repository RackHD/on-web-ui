// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';

export default class CenterBox extends Component {

  render() {
    return (
      <div className="CenterBox container">
        <div className="row" style={{padding: '0 0 20px 0'}}>
          <div className="one-third column">&nbsp;</div>
          <div className="one-third column">
            {this.props.children}
          </div>
          <div className="one-third column">&nbsp;</div>
        </div>
      </div>
    );
  }

}
