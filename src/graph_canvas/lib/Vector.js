// Copyright 2015, EMC, Inc.

import { vec2 } from 'gl-matrix';

export default class Vector {

  constructor(x, y) {
    if (x && typeof x === 'object') {
      y = x.y || x[1];
      x = x.x || x[0]; // Must be last.
    }
    this.x = x || 0;
    this.y = y || 0;
  }

  /* eslint-disable no-return-assign */
  get x() { return this[0]; }
  set x(value) { return this[0] = value; }

  get y() { return this[1]; }
  set y(value) { return this[1] = value; }
  /* eslint-enable no-return-assign */

  get length() { return 2; }

  toArray() { return [this.x, this.y]; }

  toString() { return vec2.str(this); }

  toCSS3Transform(unit='px') {
    return 'translate(' + this.x + unit + ',' + this.y + unit + ')';
  }

  toScreenSpace(viewMatrix) {
    return this.transform(viewMatrix);
  }

  toWorldSpace(viewMatrix) {
    return this.transform(viewMatrix.invert());
  }

  finite() { return new Vector(
    isFinite(this.x) ? this.x : 0,
    isFinite(this.y) ? this.y : 0
  ); }

  squish(scalar) { return new Vector(this.x / scalar, this.y / scalar); }

  // gl matrix methods

  add(vector) { return vec2.add(new Vector(), this, vector); }

  clone() { return new Vector(this); }

  copy(source) { return vec2.copy(this, source); }

  cross(vector) { return vec2.cross(new Vector(), this, vector); }

  dist(vector) { return vec2.dist(this, vector); }

  distance(vector) { return vec2.distance(this, vector); }

  div(vector) { return vec2.div(new Vector(), this, vector); }

  divide(vector) { return vec2.divide(new Vector(), this, vector); }

  dot(vector) { return vec2.dot(this, vector); }

  static forEach(array, stride, offset, count, fn, arg) {
    return vec2.forEach(array, stride, offset, count, fn, arg);
  }

  len() { return vec2.len(this); }

  vlength() { return vec2.length(this); }

  lerp(vector, amount) { return vec2.lerp(new Vector(), this, vector, amount); }

  max(vector) { return vec2.max(new Vector(), this, vector); }

  min(vector) { return vec2.min(new Vector(), this, vector); }

  mul(vector) { return vec2.mul(new Vector(), this, vector); }

  multiply(vector) { return vec2.multiply(new Vector(), this, vector); }

  negate() { return vec2.negate(new Vector(), this); }

  normalize() { return vec2.negate(new Vector(), this); }

  random(scale) { return vec2.random(new Vector(), scale); }

  scale(scalar) { return vec2.scale(new Vector(), this, scalar); }

  scaleAndAdd(vector, scale) { return vec2.scaleAndAdd(new Vector(), this, vector, scale); }

  set(x, y) { return vec2.set(this, x, y); }

  sqrDist(vector) { return vec2.sqrDist(this, vector); }

  squaredDistance(vector) { return vec2.squaredDistance(this, vector); }

  sqrLength() { return vec2.sqrLength(this); }

  squaredLength() { return vec2.squaredLength(this); }

  sub(vector) { return vec2.sub(new Vector(), this, vector); }

  subtract(vector) { return vec2.subtract(new Vector(), this, vector); }

  transform(matrix) {
    if (matrix && matrix.length) {
      if (matrix.length === 4) { return vec2.transformMat2(new Vector(), this, matrix); }
      if (matrix.length === 6) { return vec2.transformMat2d(new Vector(), this, matrix); }
      if (matrix.length === 9) { return vec2.transformMat3(new Vector(), this, matrix); }
      if (matrix.length === 16) { return vec2.transformMat4(new Vector(), this, matrix); }
    }
    throw new Error('Invalid transformation matrix.');
  }

}
