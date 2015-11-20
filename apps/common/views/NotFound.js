// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

export default class NotFound extends Component {

  render() {
    return (
      <div className="NotFound container">
        The page you are looking for could not be found. Please go <a href="#/">home</a>
      </div>
    );
  }

}
