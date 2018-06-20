// Copyright 2015, EMC, Inc.

export default function mixin(...mixins) {
  return function mixinDecorator(Class) {
    for (let i = 0, l = mixins.length; i < l; i++) {
      let source = mixins[i];
      if (!source) continue;
      if (typeof source === 'function') source = source.prototype;
      for (let key in source) {
        if (source.hasOwnProperty(key)) {
          let desc = Object.getOwnPropertyDescriptor(source, key);
          if (desc) Object.defineProperty(Class.prototype, key, desc);
        }
      }
    }
  };
}
