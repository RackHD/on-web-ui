'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DragEventHelpers from '../../mixins/DragEventHelpers';

// import Vector from '../../lib/Vector';

// import Node from '../../lib/Graph/Node';
// import GraphCanvasNode from '../elements/Node';

@decorate({
  propTypes: {},
  defaultProps: {},
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
@mixin.decorate(DragEventHelpers)
export default class GCNodesManager extends Component {

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }

  register(node) {}

  unregister(node) {}

}
