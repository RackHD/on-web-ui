'use strict';

import Vector from '../lib/Vector';
import Matrix from '../lib/Matrix';
import Rectangle from '../lib/Rectangle';

export default {

  // Coordinates

  get scale() {
    return this.state.scale;
  },

  get screenPosition() {
    return new Vector(this.state.screenPosition);
  },

  get worldPosition() {
    return new Vector(this.state.screenPosition).transform(this.worldSpaceTransform);
  },

  get screenSize() {
    return new Vector(this.props.screenWidth, this.props.screenHeight);
  },

  get worldSize() {
    return new Vector(this.props.worldWidth, this.props.worldHeight);
  },

  get viewBoundingBox() {
    return this.screenBoundingBox.transform(this.worldSpaceTransform);
  },

  get screenBoundingBox() {
    var screenSize = this.screenSize,
        screenPosition = this.screenPosition;
    return new Rectangle(//0, 0,
      screenPosition.x, screenPosition.y,
      screenPosition.x + screenSize.x, screenPosition.y + screenSize.y);
  },

  get worldBoundingBox() {
    var worldSize = this.worldSize;
    return new Rectangle().setWorld(worldSize.x, -worldSize.y);
  },

  get worldSpaceTransform() {
    var s = this.scale;
    return new Matrix().
      identity().
      translate(this.screenSize.div([2, 2]).sub(this.worldSize.div([2, 2]))).
      scale([s, s]).
      translate(this.screenPosition.negate());
      //.
      // mul(new Matrix().
      //   identity().
      //   translate(this.screenSize.div([2, 2]).sub(this.worldSize.div([2, 2])))
      // );
  },

  get screenSpaceTransform() {
    return this.worldSpaceTransform.invert();
  },

  // Events

  get translateWorldListeners() {
    return {
      down: (event, dragState) => {
        if (event.shiftKey) {
          this.drawNode(null, {shiftKey: (dragState.shiftKey = true)})(event);
        }
        if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
        // var scale = this.state.scale;
        dragState.start = new Vector(this.state.screenPosition);
        dragState.min = new Vector(-1000, -1000);
        dragState.max = new Vector(1000, 1000);
      },
      move: (event, dragState) => {
        if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
        var scale = this.scale,
            start = dragState.start,
            min = dragState.min,
            max = dragState.max;
        this.setState({
          screenPosition: {
            x: Math.min(max.x, Math.max(min.x, start.x - (event.diffX / scale))),
            y: Math.min(max.y, Math.max(min.y, start.y - (event.diffY / scale)))
          }
        });
      },
      up: (event, dragState) => {
        if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
      }
    };
  },

  scaleWorld(event) {
    event.stopPropagation();
    event.preventDefault();
    this.offsetEventXY(event);
    var scale = this.scale,
        // screenPosition = this.screenPosition,
        // mousePosition = new Vector(event.relX, event.relY),
        force = Math.max(0.1, scale / 5);
    // console.log(event.deltaY);
    if (event.deltaY < 0) {
      scale = Math.max(0.5, scale - force);
    }
    else {
      scale = Math.min(5, scale + force);
    }
    // console.log(this.viewBoundingBox);
    this.setState({ scale });
  }

};
