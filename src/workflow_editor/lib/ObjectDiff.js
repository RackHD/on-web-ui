// Copyright 2015, EMC, Inc.

import cloneDeep from 'lodash/cloneDeep';

function typeOf(obj) {
  return Array.isArray(obj) ? 'array' : typeof obj;
}

function toString(type, val) {
  if (type === 'object' || type === 'array') return '';
  return String(val) + ' ';
}

function clone(val, type) {
  if (type === 'object' || type === 'array') {
    return cloneDeep(val);
  }
  return val;
}

export default class ObjectDiff {

  diff(a, b, path = [], results = []) {
    if (a === b) { return results; }

    let typeA = typeOf(a),
        typeB = typeOf(b),
        stringA = toString(typeA, a),
        stringB = toString(typeB, b);

    if (a === undefined) {
      // property added
      results.push({operation: 'add', value: clone(b, typeB), path: path.join('.')});
    }
    else if (b === undefined) {
      // property removed
      results.push({operation: 'remove', path: path.join('.')});
    }
    else if (typeA !== typeB || (typeA !== 'object' && typeA !== 'array' && a !== b)) {
      // property changed
      results.push({operation: 'change', value: clone(b, typeB), path: path.join('.')});
    }
    else if (typeA === 'object' || typeA === 'array' || typeB === 'object' || typeB === 'array') {
      // both objects
      let keysA = a && typeof a === 'object' ? Object.keys(a) : [],
          keysB = b && typeof b === 'object' ? Object.keys(b) : [],
          allKeys = [].concat(keysA);

      keysB.forEach(key => {
        if (allKeys.indexOf(key) === -1) allKeys.push(key);
      });

      allKeys.forEach(key => {
        this.diff(a && a[key], b && b[key], path.concat([key]), results);
      });
    }

    return results;
  }

  patch(target, diffs, handler) {
    diffs.forEach(diff => {
      let current = target,
          path = diff.path.split('.'),
          last = path.pop();

      path.forEach(key => {
        current = current[key] || (current[key] = typeof key === 'number' ? [] : {});
      });

      if (handler && handler(current, diff)) { return; }

      if (diff.operation === 'remove') {
        delete current[last];
      }
      else {
        current[last] = diff.value;
      }
    });

    return target;
  }

}
