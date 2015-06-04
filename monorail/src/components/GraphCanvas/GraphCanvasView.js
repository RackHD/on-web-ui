'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
import StyleHelpers from 'common-web-ui/mixins/StyleHelpers';
import DragEventHelpers from './mixins/DragEventHelpers';
import WorldSpaceHelpers from './mixins/WorldSpaceHelpers';
/* eslint-enable no-unused-vars */

import Vector from './lib/Vector';
import Rectangle from './lib/Rectangle';
import GraphCanvasGrid from './GraphCanvasGrid';
import './GraphCanvasView.less';

@decorateComponent({
  propTypes: {
    worldWidth: PropTypes.number,
    worldHeight: PropTypes.number,
    screenWidth: PropTypes.number,
    screenHeight: PropTypes.number
  },
  defaultProps: {
    worldWidth: 800,
    worldHeight: 600,
    screenWidth: 400,
    screenHeight: 300
  }
})
@mixin.decorate(WorldSpaceHelpers)
@mixin.decorate(DragEventHelpers)
@mixin.decorate(StyleHelpers)
export default class GraphCanvasView extends Component {

  state = {
    screenPosition: new Vector(0, 0),
    scale: 1,
    marks: []
  };

  render() { try {
    var screenSize = this.screenSize,
        worldSize = this.worldSize,
        gridBoundingBox = new Rectangle(0, 0, worldSize.x, worldSize.y),
        worldSpaceTransform = this.worldSpaceTransform,
        cssWorldSpaceTransform = {
          transform: worldSpaceTransform.toCSS3Transform()
        },
        cssScreenSize = {
          width: screenSize.x,
          height: screenSize.y
        },
        cssWorldSize = {
          width: worldSize.x,
          height: worldSize.y
        };
    return (
      <div
          className="GraphCanvasMap"
          onMouseDown={this.translateWorld()}
          onWheel={this.scaleWorld.bind(this)}
          style={cssScreenSize}>
        <div
            ref="view"
            className="view"
            style={cssScreenSize}>
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
              style={{
                width: worldSize.x,
                height: worldSize.y
              }}>
              {this.markElements}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) { console.error(err.stack || err); } }

  translateWorld() {
    return this.setupClickDrag(this.translateWorldListeners);
  }

  touchWorld(event) {
    event.stopPropagation();
    event.preventDefault();
    var domoff = this.domOffsetXY(event.currentTarget);
    var client = new Vector(event.clientX, event.clientY);
    var mark = client.sub(domoff).squish(this.scale);
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
