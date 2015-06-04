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
import './GraphCanvasView.less';

@decorateComponent({
  propTypes: {
    initialX: PropTypes.number,
    initialY: PropTypes.number,
    initialScale: PropTypes.number,
    worldWidth: PropTypes.number,
    worldHeight: PropTypes.number
  },
  defaultProps: {
    initialX: 0,
    initialY: 0,
    initialScale: 1,
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
    marks: []
  };

  updatePosition(position) {
    this.setState({ position });
  }

  updateScale(scale) {
    this.setState({ scale });
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
          className="world"
          onDoubleClick={this.touchWorld.bind(this)}
          style={this.mergeAndPrefix(cssWorldSpaceTransform, cssWorldSize)}>
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
        </svg>
        <div
          className="elements"
          style={cssWorldSize}>
          {this.markElements}
        </div>
      </div>
    );
  } catch (err) { console.error(err.stack || err); } }

  touchWorld(event) {
    event.stopPropagation();
    event.preventDefault();
    // TODO: make it easier to convert event coords to world coords
    var rect = event.currentTarget.getBoundingClientRect(),
        offset = new Vector(rect.left, rect.top),
        client = new Vector(event.clientX, event.clientY),
        mark = client.sub(offset).squish(this.scale);
    console.log('Mark: ' + mark);
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
        x={mark.x - 2}
        y={mark.y - 2}
        width={3}
        height={3}
        fill="black" />;
    });
  }

  get markElements() {
    return this.marks.map(mark => {
      return <div style={{
        position: 'absolute',
        top: mark.y - 7,
        left: mark.x - 7,
        width: 10,
        height: 10,
        opacity: 0.5,
        borderRadius: 5,
        background: 'red'
      }} />;
    });
  }

}
