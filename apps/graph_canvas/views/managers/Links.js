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
    // debugger;
    var //nodeElement,
        element = socketElement,
        bounds = [],
        // HACK: get ports element of socket.
        // ports = socketElement.parentNode.parentNode.parentNode
        //           .parentNode.parentNode.parentNode.parentNode,
        // stop = 'GCNodeElement',
        c = null,
        x = 0,
        y = 0;// - ports.scrollTop;
    do {
      if (element.dataset && element.dataset.id) {
        c = this.graphCanvas.lookup(element.dataset.id);
        // console.log('c',c);
        if (c && c.state.bounds) {
          bounds.push(c.state.bounds);
        }
      }
      // else {
        x += element.offsetLeft;
        y += element.offsetTop;
      // }
      // if (nodeElement) { break; }
      // if (element.classList.contains(stop)) { nodeElement = element; }
      element = element.offsetParent;
      // debugger;
    } while(element);
    bounds.forEach(b => {
      let p = b.normalPosition;
      x += p.x;
      y += p.y;
    });
    x += socketElement.clientWidth / 2;
    y += socketElement.clientHeight / 2;
    x += 13;
    y += 11;
    // var node = this.graph.node(nodeElement.dataset.id),
    //     pos = node.bounds.normalPosition;
    // console.log(nodeElement.dataset);
    // var node = this.lookup(nodeElement.dataset.id),
        // pos = node.state.bounds.normalPosition;
    // x += pos.x;
    // y += pos.y;
    // var b = socketElement.getBoundingClientRect();
    // debugger;
    return new Vector(x, y);
    // return new Vector(b.left, b.top);
  }

}
