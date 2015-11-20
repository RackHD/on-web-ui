// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

export default class GCMarksManager extends Component {

  static propTypes = {
    initialMarks: PropTypes.array
  };

  static defaultProps = {
    initialMarks: []
  };

  static contextTypes = {
    graphCanvas: PropTypes.any
  };

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  marks = [];

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }

  updateWorld() {
    this.graphCanvas.refs.world.forceUpdate();
  }

  markWorld(event) {
    event.stopPropagation();
    event.preventDefault();

    var mark = this.graphCanvas.getEventCoords(event),
        marks = this.marks.concat([mark]);

    this.marks = marks;
    this.updateWorld();
  }

  get markVectors() {
    return this.marks.map(mark => {
      return (
        <rect
            key={mark.x + '-' + mark.y}
            x={mark.x - 1.45}
            y={mark.y - 1.45}
            width={3}
            height={3}
            fill="red" />
      );
    });
  }

  get markElements() {
    return this.marks.map(mark => {
      return <div
          key={mark.x + '-' + mark.y}
          style={{
            position: 'absolute',
            top: mark.y - 5.25,
            left: mark.x - 5.25,
            width: 10,
            height: 10,
            opacity: 0.5,
            borderRadius: 5,
            background: 'rgba(0, 0, 0, 0.5)'
          }}
          onClick={this.removeMark.bind(this, mark)} />;
    });
  }

  removeMark(mark, event) {
    event.stopPropagation();
    event.preventDefault();

    var marks = this.marks.filter(m => m !== mark);

    this.marks = marks;
    this.updateWorld();
  }

}
