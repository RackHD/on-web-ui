'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';
import decorate from 'common-web-ui/lib/decorate';

@decorate({
  propTypes: {
    initialMarks: PropTypes.array,
    world: PropTypes.any
  },
  defaultProps: {
    initialMarks: [],
    world: null
  },
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GCMarksLayer extends Component {

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  marks = this.graphCanvas.props.initialMarks;

  render() {
    return null;
  }

  markWorld(event) {
    event.stopPropagation();
    event.preventDefault();

    var mark = this.graphCanvas.getEventCoords(event),
        marks = this.marks.concat([mark]);

    this.marks = marks;
    this.graphCanvas.setState({ marks });
  }

  get markVectors() {
    return this.marks.map(mark => {
      return (
        <rect
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
      return <div style={{
        position: 'absolute',
        top: mark.y - 5.25,
        left: mark.x - 5.25,
        width: 10,
        height: 10,
        opacity: 0.5,
        borderRadius: 5,
        background: 'rgba(0, 0, 0, 0.5)'
      }} onClick={this.removeMark.bind(this, mark)} />;
    });
  }

  removeMark(mark, event) {
    event.stopPropagation();
    event.preventDefault();

    var marks = this.marks.filter(m => m !== mark);

    this.marks = marks;
    this.graphCanvas.setState({ marks });
  }

}
