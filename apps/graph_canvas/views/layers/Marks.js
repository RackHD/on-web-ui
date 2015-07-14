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
  }
})
export default class GCMarksLayer extends Component {

  state = {
    marks: this.props.initialMarks
  };

  render() {
    return null;
  }

  markWorld(event) {
    event.stopPropagation();
    event.preventDefault();
    var mark = this.getEventCoords(event);
    this.setState(function(currentState) {
      return {marks: currentState.marks.concat([mark])};
    });
  }

  get marks() {
    return this.state.marks;
  }

  get markVectors() {
    return this.marks.map(mark => {
      return (
        <rect
            x={mark.x - 1.45}
            y={mark.y - 1.45}
            width={3}
            height={3}
            fill="rgba(0, 0, 0, 0.5)" />
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
        background: 'red'
      }} onClick={this.removeMark.bind(this, mark)} />;
    });
  }

  removeMark(mark, event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      marks: this.marks.filter(m => m !== mark)
    });
  }

}
