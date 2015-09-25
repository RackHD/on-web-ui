// Copyright 2015, EMC, Inc.

'use strict';

export default function mixin(...mixins) {
  return function mixinDecorator(Class) {
    for (let i = 0, l = mixins.length; i < l; i++) {
      let source = mixins[i];
      if (!source) continue;
      if (typeof source === 'function') source = source.prototype;
      for (let key in source) {
        let desc = Object.getOwnPropertyDescriptor(source, key);
        if (desc) Object.defineProperty(Class.prototype, key, desc);
      }
    }
  }
}
