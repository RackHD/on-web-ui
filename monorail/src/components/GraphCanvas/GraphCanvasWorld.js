'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
import StyleHelpers from 'common-web-ui/mixins/StyleHelpers';
import WorldSpaceHelpers from './mixins/WorldSpaceHelpers';
/* eslint-enable no-unused-vars */

import Vector from './lib/Vector';
import Rectangle from './lib/Rectangle';
import GraphCanvasGrid from './GraphCanvasGrid';
import './GraphCanvasView.less';

@decorateComponent({
  propTypes: {
    initialViewX: PropTypes.number,
    initialViewY: PropTypes.number,
    initialScale: PropTypes.number,
    worldWidth: PropTypes.number,
    worldHeight: PropTypes.number
  },
  defaultProps: {
    initialViewX: 0,
    initialViewY: 0,
    initialSCale: 1,
    worldWidth: 800,
    worldHeight: 600
  }
})
@mixin.decorate(WorldSpaceHelpers)
@mixin.decorate(StyleHelpers)
export default class GraphCanvasView extends Component {

  state = {
    viewPosition: new Vector(this.props.initialViewX, this.props.initialViewY),
    scale: this.props.initialScale,
    marks: []
  };

  updateViewPosition(viewPosition) {
    this.setState({ viewPosition });
  }

  updateScale(scale) {
    this.setState({ scale });
  }

  render() { try {
    var worldSize = this.worldSize,
        gridBoundingBox = new Rectangle(0, 0, worldSize.x, worldSize.y),
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
            viewBox={'0 0 ' + worldSize.x + ' ' + worldSize.y}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg">
          <GraphCanvasGrid
              top={gridBoundingBox.top}
              left={gridBoundingBox.left}
              width={gridBoundingBox.width}
              height={gridBoundingBox.height} />
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
    var offset = this.domOffsetXY(event.currentTarget),
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
