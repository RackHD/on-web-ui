'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DragEventHelpers from '../../mixins/DragEventHelpers';

import Vector from '../../lib/Vector';

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

  // links = this.graphCanvas.props.initialLinks;

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }

  // register(link) {
  //   var links = this.links;
  //
  //   if (this.links.indexOf(link) === -1) {
  //     links = this.links = links.concat([link]);
  //   }
  //
  //   this.graphCanvas.setState({ links });
  // }
  //
  // removeLink() {}


  getSocketCenter(socketElement) {
    var element = socketElement,
        bounds = [],
        c = null,
        x = 0,
        y = 0;
    // HACK: get ports element of socket.
    // var ports = socketElement.parentNode.parentNode.parentNode
    //               .parentNode.parentNode.parentNode.parentNode;
    // y -= ports.scrollTop;
    do {
      if (element.dataset && element.dataset.id) {
        c = this.graphCanvas.lookup(element.dataset.id);
        if (c && c.id && c.id.indexOf('group') === 0) { break; }
        if (c && c.state && c.state.bounds) { bounds.push(c.state.bounds); }
      }
      x += element.offsetLeft;
      y += element.offsetTop;
      if (c && c.id && c.id.indexOf('node') === 0) { break; }
      element = element.offsetParent;
    } while(element);
    bounds.forEach(b => {
      let p = b.position;
      x += p.x;
      y += p.y;
    });
    x += socketElement.clientWidth / 2;
    y += socketElement.clientHeight / 2;
    // HACK: position seems to be off, not sure why yet.
    x += 7.5;
    y += 7.5;
    return new Vector(x, y);
  }

}
