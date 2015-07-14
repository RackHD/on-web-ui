'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DragEventHelpers from '../../mixins/DragEventHelpers';
/* eslint-enable no-unused-vars */

import Vector from '../../lib/Vector';

import Node from '../../lib/Graph/Node';
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
    // var activeNode = this.state.activeNode &&
    //       <GraphCanvasNode ref={this.state.activeNode.id} active={true} canvas={this} model={this.state.activeNode} />,
    //     nodes = this.state.nodes.map(node =>
    //       <GraphCanvasNode ref={node.id} key={node.id} canvas={this} model={node} />);
    return null;
  }

  drawNode() {
    return this.setupClickDrag({
      down: (event, dragState) => {
        event.stopPropagation();
        event.preventDefault();
        var dom = React.findDOMNode(this);
        dragState.node = new Node({
          graph: this.graph,
          bounds: this.getEventCoords(event, dom),
          layer: 1,
          scale: 1,
          ports: [
            {name: 'Flow', sockets: [
              {type: 'Signal', dir: [-1, 0]},
              {type: 'Failure', dir: [1, 0]},
              {type: 'Success', dir: [1, 0]},
              {type: 'Complete', dir: [1, 0]}
            ]}
          ]
        });
        dragState.node.bounds.max = dragState.node.bounds.min;
      },
      move: (event, dragState) => {
        if (this.state.activeLink) { return; }
        event.stopPropagation();
        var dom = React.findDOMNode(this);
        dragState.node.bounds.max = this.getEventCoords(event, dom);
        this.setState({activeNode: dragState.node});
      },
      up: (event, dragState) => {
        event.stopPropagation();
        var node = dragState.node;
        this.setState({activeNode: null});
        this.graph.add(dragState.node);
        this.addNode(node);
      }
    });
  }

  // Link events

  getSocketCenter(socketElement) {
    var nodeElement,
        element = socketElement,
        // HACK: get ports element of socket.
        ports = socketElement.parentNode.parentNode.parentNode
                  .parentNode.parentNode.parentNode.parentNode,
        stop = 'GraphCanvasNode',
        x = 0,
        y = 0 - ports.scrollTop;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      if (nodeElement) { break; }
      if (element.classList.contains(stop)) { nodeElement = element; }
      element = element.offsetParent;
    } while(element);
    x += socketElement.clientWidth / 2;
    y += socketElement.clientHeight / 2;
    var node = this.graph.node(nodeElement.dataset.id),
        pos = node.bounds.normalPosition;
    x += pos.x;
    y += pos.y;
    return new Vector(x, y);
  }

  // List management

  selectNode(node, shiftKey) {
    this.selected = this.selected || [];
    var isSelected = this.selected.indexOf(node) !== -1;
    if (!shiftKey) { this.unselectAllNodes(); }
    if (isSelected) { return this.unselectNode(node); }
    this.selected.push(node);
    node.data = node.data || {};
    node.data.selected = true;
    if (this.refs[node.id]) {
      this.refs[node.id].setState({selected: true});
    }
    if (this.props.selectionHandler) {
      this.props.selectionHandler(this.selected);
    }
    // this.fixLinkPositions(node._graph.links);
  }

  unselectNode(node) {
    node.data = node.data || {};
    node.data.selected = false;
    if (this.refs[node.id]) {
      this.refs[node.id].setState({selected: false});
    }
    if (this.selected) {
      this.selected = this.selected.filter(n => n !== node);
    }
    if (this.props.selectionHandler) {
      this.props.selectionHandler(this.selected);
    }
  }

  unselectAllNodes() {
    if (this.selected) {
      this.selected.forEach(n => this.unselectNode(n));
    }
    if (this.props.selectionHandler) {
      this.props.selectionHandler(this.selected);
    }
  }

  addNode(node) {
    node.layer = 0;
    this.graph.add(node);
    this.setState({nodes: this.graph.nodes});
  }

  removeNode(node) {
    this.graph.remove(node);
    this.setState({
      nodes: this.graph.nodes,
      links: this.graph.links
    });
  }

  moveNode(nodeRef, displaceX, displaceY) {
    var node = this.graph.nodes.filter(n => n.id === nodeRef)[0],
        links = this.graph.links.filter(l => l.data.from === nodeRef || l.data.to === nodeRef),
        displace = new Vector(displaceX, displaceY).squish(this.scale).negate();
    node.bounds.translate(displace);
    links.forEach(l => {
      if (l.data.from === nodeRef) {
        l.data.bounds.min = l.data.bounds.min.add(displace);
      }
      else {
        l.data.bounds.max = l.data.bounds.max.add(displace);
      }
    });
    this.setState({
      nodes: this.graph.nodes,
      links: this.graph.links
    });
  }

}
