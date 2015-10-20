// Copyright 2015, EMC, Inc.

'use strict';

export default class <%= file %> {

  static create() {
    return new <%= file %>();
  }

  constructor() {
    this._property = true;
  }

  set property(value) {
    this._property = value;
  }

  get property() {
    return this._property;
  }

  method() { return true; }

}
