// Copyright 2015, EMC, Inc.

import Vector from './Vector';
import Matrix from './Matrix';

// It is called Rectangle but it is really a AxisAlignedBoundingBox
export default class Rectangle {

  constructor(min, max, x, y) {
    if (arguments.length === 1 && min) {
      max = new Vector(min[2] || min.right, min[3] || min.bottom);
      min = new Vector(min[0] || min.left, min[1] || min.top);
    }
    else if (arguments.length === 4) {
      min = new Vector(min, max);
      max = new Vector(x, y);
    }
    if (min && min.max && !max) {
      max = min.max;
      min = min.min;
    }
    this.min = this.min || min || new Vector(-1, -1);
    this.max = this.max || max || new Vector(1, 1);
  }

  toScreenSpace(viewMatrix) {
    let bbox = new Rectangle(this);
    bbox.min = bbox.min.toScreenSpace(viewMatrix);
    bbox.max = bbox.max.toScreenSpace(viewMatrix);
    return bbox;
  }

  toWorldSpace(viewMatrix) {
    let bbox = new Rectangle(this);
    bbox.min = bbox.min.toWorldSpace(viewMatrix);
    bbox.max = bbox.max.toWorldSpace(viewMatrix);
    return bbox;
  }

  toObject() {
    return {
      left: this.left,
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      width: this.width,
      height: this.height
    };
  }

  toArray() { return [this.left, this.top, this.right, this.bottom]; }

  toString() { return this.toArray().toString(); }

  toSVGViewBox() { return this.toArray().join(' '); }

  fromCenter(width, height) {
    let halfWidth = width / 2,
        halfHeight = height / 2;
    this.top = halfHeight;
    this.right = halfWidth;
    this.bottom = -halfHeight;
    this.left = -halfWidth;
    return this;
  }

  get dir() {
    let a = this.min,
        b = this.max;
    return new Vector(
      a.x < b.x ? 1 : -1,
      a.y < b.y ? 1 : -1
    );
  }

  get normalPosition() {
    let dir = this.dir;
    return new Vector(
      this[dir.x > 0 ? 'left' : 'right'],
      this[dir.y > 0 ? 'top' : 'bottom']
    );
  }

  normalize() {
    let position = this.position,
        bottom = position.y + this.height,
        right = position.x + this.width;
    return new Rectangle(position.x, position.y, right, bottom);
  }

  get css() {
    let dir = this.dir;
    return {
      top: this[dir.y > 0 ? 'top' : 'bottom'],
      left: this[dir.x > 0 ? 'left' : 'right'],
      width: this.width,
      height: this.height
    };
  }

  getCSSTransform(scale=1) {
    let pos = this.normalPosition.squish(scale),
        transform = 'scale(' + scale + ') translate(' + pos.x + 'px, ' + pos.y + 'px)';
    return {
      width: this.width,
      height: this.height,
      transform
    };
  }

  /* eslint-disable no-return-assign */
  get left() { return this.min.x; }
  set left(value) { return this.min.x = value; }

  get right() { return this.max.x; }
  set right(value) { return this.max.x = value; }

  get top() { return this.min.y; }
  set top(value) { return this.min.y = value; }

  get bottom() { return this.max.y; }
  set bottom(value) { return this.max.y = value; }
  /* eslint-enable no-return-assign */

  get width() { return Math.abs(this.right - this.left); }
  set width(value) {
    let scale = this.width / value;
    return this.scale(new Vector(scale, 1));
  }

  get height() { return Math.abs(this.bottom - this.top); }
  set height(value) {
    let scale = this.height / value;
    return this.scale(new Vector(1, scale));
  }

  get center() {
    return new Vector(
      this.left + (this.width / 2),
      this.top + (this.height / 2)
    );
  }
  set center(vector) {
    let diffVector = vector.sub(this.center);
    return this.translate(diffVector);
  }

  get position() { return new Vector(this.left, this.top); }
  set position(vector) {
    let diffVector = vector.sub(this.position);
    return this.translate(diffVector);
  }

  get aspectRatio() { return this.width / this.height; }

  get squareRoot() { return Math.sqrt(this.width * this.height); }

  get largestSide() { return this.width > this.height ? this.width : this.height; }

  get smallestSide() { return this.width < this.height ? this.width : this.height; }

  clone() { return new Rectangle(this); }

  copy(source) {
    this.top = source.top;
    this.right = source.right;
    this.bottom = source.bottom;
    this.left = source.left;
    return this;
  }

  scale(vector) {
    let scaleMatrix = new Matrix().identity().scale(vector);
    return this.transform(scaleMatrix);
  }

  translate(vector) {
    let translateMatrix = new Matrix().identity().translate(vector);
    return this.transform(translateMatrix);
  }

  transform(matrix) {
    this.min = this.min.transform(matrix);
    this.max = this.max.transform(matrix);
    return this;
  }

  intersectsBox(bbox) {
    return !(this.left > bbox.right ||
             this.right < bbox.left ||
             this.top < bbox.bottom ||
             this.bottom > bbox.top);
  }

  intersectsBox2(bbox) {
    let x = 2 * Math.abs(this.left - bbox.left),
        y = 2 * Math.abs(this.top - bbox.top),
        w = this.width + bbox.width,
        h = this.height + bbox.height;
    return x < w && y < h;
  }

  containsVector(vector) {
    return vector.x > this.left && vector.x < this.right &&
           vector.y > this.top && vector.y < this.bottom;
  }

  containsBox(bbox) {
    return this.left < bbox.left &&
           this.right > bbox.right &&
           this.top > bbox.top &&
           this.bottom < bbox.bottom;
  }

}
