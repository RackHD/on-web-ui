// Copyright 2015, EMC, Inc.

export default function generateId(prefix) {

  prefix = prefix ? prefix + '_' : '';

  return prefix +
    (Math.floor(1024 + Math.random() * 31743)).toString(32);

}
