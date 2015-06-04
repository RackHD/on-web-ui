'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
import StyleHelpers from 'common-web-ui/mixins/StyleHelpers';
import CoordinateHelpers from './mixins/CoordinateHelpers';
/* eslint-enable no-unused-vars */

import Vector from './lib/Vector';
import GraphCanvasGrid from './GraphCanvasGrid';

@decorateComponent({
  propTypes: {
    initialElements: PropTypes.any,
    initialVectors: PropTypes.any,
    initialScale: PropTypes.number,
    initialX: PropTypes.number,
    initialY: PropTypes.number,
    worldWidth: PropTypes.number,
    worldHeight: PropTypes.number
  },
  defaultProps: {
    initialElements: [],
    initialVectors: [],
    initialScale: 1,
    initialX: 0,
    initialY: 0,
    worldWidth: 800,
    worldHeight: 600
  }
})
@mixin.decorate(CoordinateHelpers)
@mixin.decorate(StyleHelpers)
export default class GraphCanvasView extends Component {

  state = {
    position: new Vector(
      this.props.initialX,
      this.props.initialY
    ),
    scale: this.props.initialScale,
    vectors: this.props.initialVectors,
    elements: this.props.initialElements,
    marks: []
  };

  updatePosition(position) {
    this.setState({ position });
  }

  updateScale(scale) {
    this.setState({ scale });
  }

  updateVectors(vectors) {
    this.setState({ vectors });
  }

  updateElements(elements) {
    this.setState({ elements });
  }

  render() { try {
    var worldSize = this.worldSize,
        worldBoundingBox = this.worldBoundingBox,
        cssWorldSpaceTransform = {
          transform: this.worldSpaceTransform.toCSS3Transform()
        },
        cssWorldSize = {
          width: worldSize.x,
          height: worldSize.y
        };
    return (
      <div
          ref="world"
          className="GraphCanvasWorld"
          onDoubleClick={this.touchWorld.bind(this)}
          style={this.mergeAndPrefix(cssWorldSpaceTransform, cssWorldSize)}>
        <canvas className="rastors"></canvas>
        <svg
            className="vectors"
            width={worldSize.x}
            height={worldSize.y}
            style={cssWorldSize}
            viewBox={worldBoundingBox.toSVGViewBox()}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg">
          <GraphCanvasGrid
              top={worldBoundingBox.top}
              left={worldBoundingBox.left}
              width={worldBoundingBox.width}
              height={worldBoundingBox.height} />
          {this.markVectors}
          {this.state.vectors}
        </svg>
        <div
          className="elements"
          style={cssWorldSize}>
          {this.markElements}
          {this.state.elements}
          {this.props.children}
        </div>
      </div>
    );
  } catch (err) { console.error(err.stack || err); } }

  touchWorld(event) {
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
      return <rect
        x={mark.x - 1.45}
        y={mark.y - 1.45}
        width={3}
        height={3}
        fill="rgba(0, 0, 0, 0.5)" />;
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
      }} />;
    });
  }

}
