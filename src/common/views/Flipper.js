// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

export default class Flipper extends Component {

  state = {};

  render() {
    let className = 'FlipperRoot ';
    if (this.state.flip) {
      className += ' flip';
    }
    if (this.state.flipping) {
      className += ' flipping' + this.state.flipping;
    }
    return (
      <div className={className}>
        <div className="flipper">
          <div className="front">
            {this.props.front || this.props.children}
          </div>
          <div className="back">
            {this.props.back}
          </div>
        </div>
      </div>
    );
  }

  toggleFlip() {
    if (this.state.flipping) { return; }
    this.setState({
      flipping: this.state.flip ? 'Back' : 'Front',
      flip: !this.state.flip
    });
    // TODO: use css transition end event for this:
    setTimeout(() => this.setState({flipping: null}), 750);
  }

}
