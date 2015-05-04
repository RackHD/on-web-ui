'use strict';

import moment from 'moment';

const ellipsis = '\u2026';

export default {

  fromNow: (time) => {
    return moment(time).fromNow();
  },

  shortId: (id) => {
    return id.substring(0, 3) + ellipsis +
           id.substring(id.length - 3, id.length);
  }

};
