'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DragEventHelpers from '../../mixins/DragEventHelpers';
/* eslint-enable no-unused-vars */

// import Vector from '../../lib/Vector';

// import Link from '../../lib/Graph/Link';
// import GraphCanvasLink from '../elements/Link';

@decorate({
  propTypes: {},
  defaultProps: {},
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
@mixin.decorate(DragEventHelpers)
export default class GCLinksManager extends Component {

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  links = this.graphCanvas.props.initialLinks;

  render() {
    return null;
  }

  register(link) {
    var links = this.links;

    if (this.links.indexOf(link) === -1) {
      links = this.links = links.concat([link]);
    }

    this.graphCanvas.setState({ links });
  }

  removeLink() {}

}
