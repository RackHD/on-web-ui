// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';

import { Link } from 'react-router';

export default class NotFound extends Component {

  render() {
    return (
      <div className="NotFound container">
        The page you are looking for could not be found. Please go <Link to="/">home</Link>
      </div>
    );
  }

}
