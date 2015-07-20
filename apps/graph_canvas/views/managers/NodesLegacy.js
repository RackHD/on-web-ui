'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DragEventHelpers from '../../mixins/DragEventHelpers';
/* eslint-enable no-unused-vars */

import Vector from '../../lib/Vector';

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

  nodes = this.graphCanvas.props.initialNodes;

  render() {
    return null;
  }

  selectNode(node, shiftKey) {
    this.graphCanvas.selected = this.selected || [];
    var isSelected = this.graphCanvas.selected.indexOf(node) !== -1;
    if (!shiftKey) { this.unselectAllNodes(); }
    if (isSelected) { return this.unselectNode(node); }
    this.graphCanvas.selected.push(node);
    node.data = node.data || {};
    node.data.selected = true;
    if (this.graphCanvas.refs[node.id]) {
      this.graphCanvas.refs[node.id].setState({selected: true});
    }
    if (this.graphCanvas.selectionHandler) {
      this.graphCanvas.selectionHandler(this.graphCanvas.selected);
    }
    // this.graphCanvas.fixLinkPositions(node._graph.links);
  }

  unselectNode(node) {
    node.data = node.data || {};
    node.data.selected = false;
    if (this.graphCanvas.refs[node.id]) {
      this.graphCanvas.refs[node.id].setState({selected: false});
    }
    if (this.graphCanvas.selected) {
      this.graphCanvas.selected = this.graphCanvas.selected.filter(n => n !== node);
    }
    if (this.graphCanvas.selectionHandler) {
      this.graphCanvas.selectionHandler(this.graphCanvas.selected);
    }
  }

  unselectAllNodes() {
    if (this.graphCanvas.selected) {
      this.graphCanvas.selected.forEach(n => this.unselectNode(n));
    }
    if (this.graphCanvas.selectionHandler) {
      this.graphCanvas.selectionHandler(this.graphCanvas.selected);
    }
  }

  addNode(node) {
    node.layer = 0;
    this.graphCanvas.graph.add(node);
    this.graphCanvas.setState({nodes: this.graphCanvas.graph.nodes});
  }

  removeNode(node) {
    this.graphCanvas.graph.remove(node);
    this.graphCanvas.setState({
      nodes: this.graphCanvas.graph.nodes,
      links: this.graphCanvas.graph.links
    });
  }

  moveNode(nodeRef, displaceX, displaceY) {
    var node = this.graphCanvas.graph.nodes.filter(n => n.id === nodeRef)[0],
        links = this.graphCanvas.graph.links.filter(l => l.data.from === nodeRef || l.data.to === nodeRef),
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
    this.graphCanvas.setState({
      nodes: this.graphCanvas.graph.nodes,
      links: this.graphCanvas.graph.links
    });
  }

}
