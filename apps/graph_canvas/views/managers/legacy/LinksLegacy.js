'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DragEventHelpers from '../../mixins/DragEventHelpers';

// import Vector from '../../lib/Vector';
import Rectangle from '../../lib/Rectangle';

import Link from '../../lib/Graph/Link';
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
  activeLink = null;

  render() {
    return null;
  }

  drawLinkStart(event, dragState, e) {
    event.stopPropagation();
    dragState.fromNode = this.graphCanvas.refs.viewport.delegatesTo(e.target, 'GraphCanvasNode');
    var dom = this.graphCanvas.refs.viewport.delegatesTo(e.target, 'GraphCanvasSocketIcon'),
        start;
    if (dom) {
      start = this.graphCanvas.getSocketCenter(dom);
    }
    else {
      dom = React.findDOMNode(this.graphCanvas.refs.world);
      start = this.graphCanvas.getEventCoords(event, dom);
    }
    dragState.link = new Link({
      data: {
        bounds: new Rectangle(start),
        fromNode: dragState.fromNode,
        fromSocket: this.graphCanvas.refs.viewport.delegatesTo(e.target, 'GraphCanvasSocket')
      },
      layer: 1,
      scale: 1
    });
  }

  drawLinkContinue(event, dragState, e) {
    event.stopPropagation();
    var dom = this.delegatesTo(e.target, 'GraphCanvasSocketIcon'),
        end;
    if (dom) {
      end = this.graphCanvas.getSocketCenter(dom);
    } else {
      dom = React.findDOMNode(this.graphCanvas.refs.world);
      end = this.graphCanvas.getEventCoords(event, dom);
    }
    dragState.link.data.bounds.max = end;
    this.activeLink = dragState.link;
  }

  drawLinkFinish(event, dragState, e) {
    event.stopPropagation();
    var isTargetNode = this.graphCanvas.refs.viewport.delegatesTo(e.target, 'GraphCanvasNode');
    dragState.link.data.toNode = isTargetNode;
    dragState.link.data.toSocket = this.graphCanvas.refs.viewport.delegatesTo(e.target, 'GraphCanvasSocket');
    if (dragState.link && isTargetNode && isTargetNode !== dragState.fromNode) {
      this.addLink(dragState.link);
    }
    this.activeLink = null;
  }

  addLink(link) {
    var nodeIdA = link.data.fromNode.dataset.id,
        nodeIdB = link.data.toNode.dataset.id,
        socketIdA = link.data.fromSocket.dataset.id,
        socketIdB = link.data.toSocket.dataset.id;
    link.layer = 0;
    link.data.from = nodeIdA;
    link.data.to = nodeIdB;
    link.socketOut = socketIdA;
    link.socketIn = socketIdB;
    this.graphCanvas.graph.connect(link);
    this.graphCanvas.setState({links: this.graphCanvas.graph.links});
  }

  removeLink(link) {
    this.graphCanvas.graph.disconnect(link);
    this.graphCanvas.setState({links: this.graphCanvas.graph.links});
  }

}
