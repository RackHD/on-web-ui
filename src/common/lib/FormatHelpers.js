// Copyright 2015, EMC, Inc.

import moment from 'moment';

const ellipsis = '\u2026';

export default {

  fromNow: (time) => {
    let m = moment(time);
    if (!time || !m.isValid()) { return null; }
    return m.fromNow();
  },

  longDate: (time) => {
    let m = moment(time);
    if (!time || !m.isValid()) { return null; }
    return m.format('dddd, MMMM Do YYYY, h:mm:ss a');
  },

  shortId: (id) =>
    typeof id === 'string' ?
      id.substring(id.length - 6, id.length) :
      id,

  truncate: (val, size) => {
    size = size / 2;
    return val.substring(0, size) + ellipsis +
           val.substring(val.length - size, val.length);
  }

};
