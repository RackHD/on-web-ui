// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

import mixin from 'common-web-ui/lib/mixin';

import DragEventHelpers from '../../mixins/DragEventHelpers';

// import Vector from '../../lib/Vector';

// import Node from '../../lib/Graph/Node';
// import GraphCanvasNode from '../elements/Node';

@mixin(DragEventHelpers)
export default class GCNodesManager extends Component {

  static contextTypes = {
    graphCanvas: PropTypes.any
  };

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }

  register(node) {} // eslint-disable-line no-unused-vars

  unregister(node) {} // eslint-disable-line no-unused-vars

}
