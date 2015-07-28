'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DragEventHelpers from '../../mixins/DragEventHelpers';

import generateId from '../../lib/generateId';
import Vector from '../../lib/Vector';

import GCLinkElement from '../elements/Link';

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

  get graphCanvasWorld() {
    return this.graphCanvas.refs.world;
  }

  get graphCanvasViewport() {
    return this.graphCanvas.refs.world;
  }

  // links = this.graphCanvas.props.initialLinks;

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }

  register(link) {
    this.graphCanvas.associateLink(link);
  }

  unregister(link) {
    this.graphCanvas.forgetLinkAssociation(link);
  }

  getSocketCenter(socketElement) {
    var element = socketElement,
        bounds = [],
        c = null,
        x = 0,
        y = 0;
    do {
      if (element.dataset && element.dataset.id) {
        c = this.graphCanvas.lookup(element.dataset.id);
        if (c && c.id && c.id.indexOf('group') === 0) { break; }
        if (c && c.state && c.state.bounds) { bounds.push(c.state.bounds); }
      }
      x += element.offsetLeft;
      y += element.offsetTop;
      if (c && c.id && c.id.indexOf('node') === 0) {
        try {
          // HACK: get ports element of socket.
          c = React.findDOMNode(c).childNodes[1].firstChild;
          // y -= Math.max(c.scrollTop,  (c.scrollHeight - c.offsetHeight - 15));
          y -= c.scrollTop;
          x -= c.scrollLeft;
        }
        catch (err) { console.error(err.stack || err); }
        break;
      }
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
    x += 5;
    y += 3;
    return new Vector(x, y);
  }

  detectSocketFromEvent(event, dragState, target) {
    var dom = this.delegatesTo(target, 'GraphCanvasSocket');
    if (dom && dom.dataset.id && dom.dataset.id !== dragState.fromId) {
      return dom.dataset.id;
    } else {
      let parent = React.findDOMNode(dragState.parentComponent);
      // console.log('PARENT', parent);
      return this.graphCanvas.getEventCoords(event, parent).sub([3, 39]);
    }
  }

  drawLinkStart(event, dragState, e) {
    this.isDrawing = true;
    event.stopPropagation();
    let fromPort = dragState.fromSocket.parentPort,
        fromGroup = fromPort.parentGroup || fromPort.parentNode.parentGroup;
    React.withContext({
      graphCanvas: this.graphCanvas,
      parentGCGroup: fromGroup
    }, () => {
      dragState.parentComponent = fromGroup || this.graphCanvasWorld;
      dragState.fromId = dragState.fromSocket.id;
      let end = this.detectSocketFromEvent(event, dragState, e.target);
      dragState.link = <GCLinkElement
          key={generateId('key')}
          from={dragState.fromSocket.id}
          to={end}
          isPartial={typeof end !== 'string'}
          initialColor={dragState.fromSocket.state.color.rgbaString()}
          initialId={generateId('link')} />;
      dragState.parentComponent.appendChild(dragState.link);
      dragState.originalLink = dragState.link;
    });
  }

  drawLinkContinue(event, dragState, e) {
    event.stopPropagation();
    event.preventDefault(); // prevent text selection
    dragState.link = this.graphCanvas.lookup(dragState.link.id || dragState.link.props.initialId);
    if (dragState.link) {
      let lastEnd = dragState.link.state.to;
      let end = this.detectSocketFromEvent(event, dragState, e.target);
      dragState.link.setState({
        isPartial: typeof end !== 'string',
        to: end
      });
      dragState.link.updateBounds();
      if (lastEnd !== end && typeof lastEnd === 'string') {
        this.graphCanvas.associateLinkConcept(
          dragState.link.state.from, lastEnd,
          dragState.link.id, null);
      }
    }
  }

  drawLinkFinish(event, dragState) {
    this.isDrawing = false;
    event.stopPropagation();
    if (dragState.link && dragState.link.state.isPartial) {
      dragState.parentComponent.removeChild(dragState.originalLink);
    }
    // debugger;
    dragState.link.forceUpdate();
  }

}
