// Copyright 2015, EMC, Inc.

// Documentation: http://glmatrix.net/docs/2.2.0/symbols/mat2d.html
import { mat2d } from 'gl-matrix';

export default class Matrix {

  constructor(a, b, c, d, tx, ty) {
    if (a && typeof a === 'object') {
      b = a.b || a[1];
      c = a.c || a[2];
      d = a.d || a[3];
      tx = a.tx || a[4];
      ty = a.ty || a[5];
      a = a.a || a[0]; // Must be last.
    }
    this.a = a || 0;
    this.b = b || 0;
    this.c = c || 0;
    this.d = d || 0;
    this.tx = tx || 0;
    this.ty = ty || 0;
  }

  /* eslint-disable no-return-assign */
  get a() { return this[0]; }
  set a(value) { return this[0] = value; }

  get b() { return this[1]; }
  set b(value) { return this[1] = value; }

  get c() { return this[2]; }
  set c(value) { return this[2] = value; }

  get d() { return this[3]; }
  set d(value) { return this[3] = value; }

  get tx() { return this[4]; }
  set tx(value) { return this[4] = value; }

  get ty() { return this[5]; }
  set ty(value) { return this[5] = value; }
  /* eslint-enable no-return-assign */

  get length() { return 6; }

  toArray() { return [this.a, this.b, this.c, this.d, this.tx, this.ty]; }

  toString() { return mat2d.str(this); }

  toCSS3Transform() { return 'matrix(' + this.toArray().join(',') + ')'; }

  clone() { return new Matrix(this); }

  copy(source) { return mat2d.copy(this, source); }

  determinant() { return mat2d.determinant(this); }

  identity() { return mat2d.identity(this); }

  invert() { return mat2d.invert(new Matrix(), this); }

  mul(matrix) { return mat2d.mul(new Matrix(), this, matrix); }

  multiply(matrix) { return mat2d.multiply(new Matrix(), this, matrix); }

  rotate(radians) { return mat2d.rotate(new Matrix(), this, radians); }

  scale(vector) { return mat2d.scale(new Matrix(), this, vector); }

  translate(vector) { return mat2d.translate(new Matrix(), this, vector); }

}
