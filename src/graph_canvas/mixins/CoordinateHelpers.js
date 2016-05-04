// Copyright 2015, EMC, Inc.

import Vector from '../lib/Vector';
import Matrix from '../lib/Matrix';
import Rectangle from '../lib/Rectangle';

export default {

  get scale() {
    return this.state.scale;
  },

  get position() {
    return new Vector(this.state.position);
  },

  get viewSize() {
    return new Vector(this.props.viewWidth, this.props.viewHeight);
  },

  get worldSize() {
    return new Vector(this.props.worldWidth, this.props.worldHeight);
  },

  get viewBoundingBox() {
    let viewSize = this.viewSize;
    return new Rectangle(0, 0, viewSize.x, viewSize.y);
  },

  get worldBoundingBox() {
    let worldSize = this.worldSize;
    return new Rectangle(0, 0, worldSize.x, worldSize.y);
  },

  get worldSpaceTransform() {
    let s = this.scale;
    return new Matrix().
      identity().
      translate(this.viewSize.squish(2).sub(this.worldSize.squish(2))).
      scale([s, s]).
      translate(this.position.negate());
  },

  get viewSpaceTransform() {
    return this.worldSpaceTransform.invert();
  },

  getEventCoords(event, element=event.currentTarget) {
    let rect = element.getBoundingClientRect(),
        offset = new Vector(rect.left, rect.top),
        client = new Vector(event.clientX, event.clientY);
    return client.sub(offset).squish(this.scale);
  }

};
