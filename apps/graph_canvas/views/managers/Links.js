'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DragEventHelpers from '../../mixins/DragEventHelpers';

import Vector from '../../lib/Vector';
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

  graph = this.context.graphCanvas.props.initialGraph;

  state = {
    position: new Vector(
      this.context.graphCanvas.props.initialX,
      this.context.graphCanvas.props.initialY
    ),
    scale: this.context.graphCanvas.props.initialScale,
    marks: [],
    activeNode: null,
    activeLink: null,
    nodes: [],
    links: []
  };
  rawNodes = [];
  rawLinks = [];

  render() {
    // var activeLink = this.state.activeLink &&
    //       <GraphCanvasLink ref={this.state.activeLink.id} active={true} canvas={this} model={this.state.activeLink} />,
    //     links = this.state.links.map(link =>
    //       <GraphCanvasLink ref={link.id} key={link.id} canvas={this} model={link} />),
    return null;
  }

  drawLinkStart(event, dragState, e) {
    event.stopPropagation();
    dragState.fromNode = this.delegatesTo(e.target, 'GraphCanvasNode');
    var dom = this.delegatesTo(e.target, 'GraphCanvasSocketIcon'),
        start;
    if (dom) {
      start = this.getSocketCenter(dom);
    }
    else {
      dom = React.findDOMNode(this);
      start = this.getEventCoords(event, dom);
    }
    dragState.link = new Link({
      data: {
        bounds: new Rectangle(start),
        fromNode: dragState.fromNode,
        fromSocket: this.delegatesTo(e.target, 'GraphCanvasSocket')
      },
      layer: 1,
      scale: 1
    });
  }

  drawLinkContinue(event, dragState, e) {
    if (this.state.activeNode) { return; }
    event.stopPropagation();
    var dom = this.delegatesTo(e.target, 'GraphCanvasSocketIcon'),
        end;
    if (dom) {
      end = this.getSocketCenter(dom);
    } else {
      dom = React.findDOMNode(this);
      end = this.getEventCoords(event, dom);
    }
    dragState.link.data.bounds.max = end;
    this.setState({activeLink: dragState.link});
  }

  drawLinkFinish(event, dragState, e) {
    event.stopPropagation();
    var isTargetNode = this.delegatesTo(e.target, 'GraphCanvasNode');
    dragState.link.data.toNode = isTargetNode;
    dragState.link.data.toSocket = this.delegatesTo(e.target, 'GraphCanvasSocket');
    if (dragState.link && isTargetNode && isTargetNode !== dragState.fromNode) {
      this.addLink(dragState.link);
    }
    this.setState({activeLink: null});
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
    this.graph.connect(link);
    this.setState({links: this.graph.links});
  }

  removeLink(link) {
    this.graph.disconnect(link);
    this.setState({links: this.graph.links});
  }

}
