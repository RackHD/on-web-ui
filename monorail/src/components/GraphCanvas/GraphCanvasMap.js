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
import Matrix from './lib/Matrix';
import Rectangle from './lib/Rectangle';
import GraphCanvasGrid from './GraphCanvasGrid';
import './GraphCanvasMap.less';

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
export default class GraphCanvasMap extends Component {

  state = {
    screenPosition: new Vector(0, 0),
    scale: 1,
    marks: []
  };

  render() { try {
    var screenSize = this.screenSize,
        worldSize = this.worldSize,
        // worldBoundingBox = this.worldBoundingBox,
        // screenBoundingBox = this.screenBoundingBox,
        // gridSize = Math.max(worldSize.x, worldSize.y),
        gridBoundingBox = new Rectangle(0, 0, 600, 600),
        // gridBoundingBox = new Rectangle().setWorld(gridSize, gridSize),
        worldSpaceTransform = this.worldSpaceTransform,
        css3WorldSpaceTransform = {
          transform: worldSpaceTransform.toCSS3Transform()
        };
    // console.log(screenSize.toString(), worldSize.toString(), gridSize);
    // console.log(
    //   'S', screenBoundingBox.toSVGViewBox(),
    //   '\nW', worldBoundingBox.toSVGViewBox(),
    //   '\nG', gridBoundingBox.toSVGViewBox());
    return (
      <div
          className="GraphCanvasMap"
          onMouseDown={this.translateWorld()}
          onWheel={this.scaleWorld.bind(this)}
          style={{
            width: screenSize.x,
            height: screenSize.y
          }}>
        <div
            ref="view"
            className="view"
            style={{
              width: screenSize.x,
              height: screenSize.y,
              border: '2px solid blue'
            }}>
          <div
              ref="world"
              className="world"
              onDoubleClick={this.touchWorld.bind(this)}
              style={this.mergeAndPrefix(css3WorldSpaceTransform, {
                width: worldSize.x,
                height: worldSize.y,
                border: '1px solid green'
              })}>
            <svg
                className="vectors"
                width={worldSize.x}
                height={worldSize.y}
                style={{
                  width: worldSize.x,
                  height: worldSize.y,
                  border: '1px dotted green'
                }}
                viewBox={'0 0 ' + worldSize.x + ' ' + worldSize.y}
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg">
              <GraphCanvasGrid
                  top={gridBoundingBox.top}
                  left={gridBoundingBox.left}
                  width={gridBoundingBox.width}
                  height={gridBoundingBox.height}
                  style={{
                    border: '1px dotted red'
                  }} />
              {this.markVectors}
            </svg>
            <div
              className="elements"
              style={{
                width: worldSize.x,
                height: worldSize.y,
                border: '2px dotted blue'
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
    // console.log('dom: ' + domoff);
    // console.log('client: ' + client);
    // console.log('diff: ' + client.sub(domoff));
    // console.log('diff*: ' + client.sub(domoff).squish(this.scale));
    // console.log(this.scale);

    var coords = client.sub(domoff).squish(this.scale);

    // if (event) { return; }
    // this.offsetEventXY(event, undefined, event.currentTarget);
    var mark = coords;//new Vector(event.relX, event.relY);
    // mark = mark.transform(this.screenSpaceTransform);
    // mark = mark.div([this.scale, this.scale]);
    console.log(
      // this.scale, this.screenPosition.toString(),
      // event.relX,
      // event.relX * this.scale,
      // event.relY * this.scale,
      'Mark: ' + mark);
    this.setState(function(currentState) {
      return {marks: currentState.marks.concat([mark])};
    });
  }

  get marks() {
    return this.state.marks;
  }

  get markVectors() {
    // var magicTransform = new Matrix().identity();
    return this.marks.map(mark => {
      // mark = mark.transform(magicTransform);
      return <rect
        x={mark.x - 0.5}
        y={mark.y - 0.5}
        width={3}
        height={3}
        fill="black" />;
    });
  }

  get markElements() {
    // var magicTransform = new Matrix().identity();
    return this.marks.map(mark => {
      // mark = mark.transform(magicTransform);
      return <div style={{
        position: 'absolute',
        top: mark.y - 5,
        left: mark.x - 5,
        width: 10,
        height: 10,
        opacity: 0.5,
        borderRadius: 5,
        background: 'red'
      }} />;
    });
  }

}
