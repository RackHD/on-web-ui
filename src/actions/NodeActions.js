'use strict';

import NodeStore from '../stores/NodeStore';

export const nodes = new NodeStore();

export default {

  fetch() {
    return nodes.fetch();
  }

};
