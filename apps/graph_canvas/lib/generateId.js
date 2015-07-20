'use strict';

export default function generateId(prefix) {

  prefix = prefix ? prefix + '-' : '';
  return prefix +
    (Math.floor(1024 + Math.random() * 31743)).toString(32) + '-' +
    Date.now().toString(32);

}
