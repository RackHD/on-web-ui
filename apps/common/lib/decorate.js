'use strict';

import merge from 'lodash/object/merge';

export default decorate;

function decorate(statics) {
  return function decorator(Class) {
    merge(Class, statics);
  };
}
