'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
import StyleHelpers from 'common-web-ui/mixins/StyleHelpers';
import CoordinateHelpers from './mixins/CoordinateHelpers';
import DragEventHelpers from './mixins/DragEventHelpers';
/* eslint-enable no-unused-vars */

import Vector from './lib/Vector';
import Rectangle from './lib/Rectangle';
import Graph from './lib/Graph';
import Node from './lib/Graph/Node';
import Link from './lib/Graph/Link';
import GraphCanvasGrid from './GraphCanvasGrid';
import GraphCanvasNode from './GraphCanvasNode';
import GraphCanvasLink from './GraphCanvasLink';

@decorateComponent({
  propTypes: {
    initialElements: PropTypes.any,
    initialVectors: PropTypes.any,
    initialScale: PropTypes.number,
    initialX: PropTypes.number,
    initialY: PropTypes.number,
    worldWidth: PropTypes.number,
    worldHeight: PropTypes.number
  },
  defaultProps: {
    initialElements: [],
    initialVectors: [],
    initialScale: 1,
    initialX: 0,
    initialY: 0,
    worldWidth: 800,
    worldHeight: 600
  }
})
@mixin.decorate(DragEventHelpers)
@mixin.decorate(CoordinateHelpers)
@mixin.decorate(StyleHelpers)
export default class GraphCanvasView extends Component {

  graph = new Graph();
  state = {
    position: new Vector(
      this.props.initialX,
      this.props.initialY
    ),
    scale: this.props.initialScale,
    marks: [],
    activeNode: null,
    activeLink: null,
    nodes: [],
    links: []
  };
  rawNodes = [];
  rawLinks = [];

  updatePosition(position) {
    this.setState({ position });
  }

  updateScale(scale) {
    this.setState({ scale });
  }

  render() {
    try {
      var worldSize = this.worldSize,
          worldBoundingBox = this.worldBoundingBox,
          cssWorldSpaceTransform = {
            transform: this.worldSpaceTransform.toCSS3Transform()
          },
          cssWorldSize = {
            width: worldSize.x,
            height: worldSize.y
          };
      this.graph.bounds = this.worldBoundingBox.clone();
      var activeNode = this.state.activeNode &&
            <GraphCanvasNode ref={this.state.activeNode.id} active={true} canvas={this} model={this.state.activeNode} />,
          activeLink = this.state.activeLink &&
            <GraphCanvasLink ref={this.state.activeLink.id} active={true} canvas={this} model={this.state.activeLink} />,
          links = this.state.links.map(link =>
            <GraphCanvasLink ref={link.id} key={link.id} canvas={this} model={link} />),
          nodes = this.state.nodes.map(node =>
            <GraphCanvasNode ref={node.id} key={node.id} canvas={this} model={node} />);
      return (
        <div
            className="GraphCanvasWorld"
            onWheel={this.scaleWorld.bind(this)}
            onMouseDown={this.translateWorld()}
            onDoubleClick={this.touchWorld.bind(this)}
            onContextMenu={this.drawNode()}
            style={this.mergeAndPrefix(cssWorldSpaceTransform, cssWorldSize)}>
          <canvas className="rastors"></canvas>
          <svg
              className="vectors"
              width={worldSize.x}
              height={worldSize.y}
              style={cssWorldSize}
              viewBox={worldBoundingBox.toSVGViewBox()}
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg">
            <GraphCanvasGrid
                top={worldBoundingBox.top}
                left={worldBoundingBox.left}
                width={worldBoundingBox.width}
                height={worldBoundingBox.height} />
            {this.markVectors}
            {links}
            {activeLink}
          </svg>
          <div
            className="elements"
            style={{width: worldSize.x, height: 0}}>
            {this.markElements}
            {nodes}
            {activeNode}
          </div>
        </div>
      );
    } catch (err) { console.error(err.stack || err); }
  }

  translateWorld() {
    return this.setupClickDrag(this.translateWorldListeners);
  }

  get translateWorldListeners() {
    return {
      down: (event, dragState) => {
        if (event.shiftKey) {
          this.drawNode(null, {shiftKey: (dragState.shiftKey = true)})(event);
        }
        if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
        dragState.start = new Vector(this.position);
        dragState.min = new Vector(-1000, -1000);
        dragState.max = new Vector(1000, 1000);
        // TODO: fix these clamps
        // var scale = this.state.scale;
        // dragState.min = new Vector(
          // (this.worldBoundingBox.left / 2) - (this.screenSize.x / 2 / scale),
          // (this.worldBoundingBox.top / 2) - (this.screenSize.y / 2 / scale)
        // );
        // dragState.max = new Vector(
          // (this.worldBoundingBox.right / 2) + (this.screenSize.x / 2 / scale),
          // (this.worldBoundingBox.bottom / 2) + (this.screenSize.y / 2 / scale)
        // );
        // console.log(this.worldBoundingBox.toArray());
        // console.log(dragState.start.toArray());
        // console.log(dragState.min.toArray(), dragState.max.toArray());
      },
      move: (event, dragState) => {
        if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
        var scale = this.scale,
            start = dragState.start,
            min = dragState.min,
            max = dragState.max;
        this.updatePosition({
          x: Math.min(max.x, Math.max(min.x, start.x - (event.diffX / scale))),
          y: Math.min(max.y, Math.max(min.y, start.y - (event.diffY / scale)))
        });
      },
      up: (event, dragState) => {
        if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
      }
    };
  }

  scaleWorld(event) {
    event.stopPropagation();
    event.preventDefault();
    this.offsetEventXY(event);
    var scale = this.scale,
        force = Math.max(0.05, scale / 5);
    if (event.deltaY < 0) {
      scale = Math.max(0.2, scale - force);
    }
    else {
      scale = Math.min(8, scale + force);
    }
    this.updateScale(scale);
  }

  // Node events

  drawNode() {
    return this.setupClickDrag({
      down: (event, dragState) => {
        event.stopPropagation();
        event.preventDefault();
        var dom = React.findDOMNode(this);
        dragState.node = new Node({
          bounds: this.getEventCoords(event, dom),
          layer: 1,
          scale: 1
        });
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

  // getSocketCenter(socketElement) {
  //   var rectA = React.findDOMNode(this).getBoundingClientRect(),
  //       rectB = socketElement.getBoundingClientRect();
  //   console.log(rectA, rectB);
  //   return new Vector(
  //     rectA.left + rectB.left + rectB.width / 2,
  //     rectB.top + rectB.top + rectB.height / 2
  //   );
  // }

  drawLinkStart(event, dragState, e) {
    event.stopPropagation();
    dragState.fromNode = this.delegatesTo(e.target, 'GraphCanvasNode');
    // var dom = this.delegatesTo(e.target, 'socket');
    // dragState.start = this.getSocketCenter(dom);
    var dom = React.findDOMNode(this);
    // dragState.start = this.getEventCoords(event, dom);
    dragState.link = new Link({
      data: {
        bounds: new Rectangle(this.getEventCoords(event, dom)),
        fromNode: dragState.fromNode
      },
      layer: 1,
      scale: 1
    });
  }

  drawLinkContinue(event, dragState, e) {
    if (this.state.activeNode) { return; }
    event.stopPropagation();
    // var start = dragState.start;
    // var dom = this.delegatesTo(e.target, 'socket'),
    //     end;
    // if (dom) {
    //   end = this.getSocketCenter(dom);
    // } else {
    //   dom = React.findDOMNode(this);
    //   end = this.getEventCoords(event, dom);
    // }
    var dom = React.findDOMNode(this),
        end = this.getEventCoords(event, dom);
    dragState.link.data.bounds.max = end;
    this.setState({activeLink: dragState.link});
  }

  drawLinkFinish(event, dragState, e) {
    event.stopPropagation();
    var isTargetNode = this.delegatesTo(e.target, 'GraphCanvasNode');
    dragState.link.data.toNode = isTargetNode;
    // console.log(isTargetNode !== dragState.fromNode, isTargetNode);
    if (dragState.link && isTargetNode && isTargetNode !== dragState.fromNode) {
      this.addLink(dragState.link, dragState.fromNode, isTargetNode);
    }
    // this.linkFromNode = null;
    this.setState({activeLink: null});
  }

  // Box calculations

  // calculateLinkBox(link) {
  //   if (link.endX < link.startX) {
  //     link.left = link.endX;
  //     link.width = link.startX - link.endX;
  //     link.dirX = -1;
  //   }
  //   else {
  //     link.left = link.startX;
  //     link.width = link.endX - link.startX;
  //     link.dirX = 1;
  //   }
  //   if (link.endY < link.startY) {
  //     link.top = link.endY;
  //     link.height = link.startY - link.endY;
  //     link.dirY = 1;
  //   }
  //   else {
  //     link.top = link.startY;
  //     link.height = link.endY - link.startY;
  //     link.dirY = -1;
  //   }
  // }

  // List management

  // newKey() {
  //   return Math.round(Math.random() * 1000 + Date.now()).toString(32);
  // }

  addNode(node) {
    node.layer = 0;
    this.graph.add(node);
    this.setState({nodes: this.graph.nodes});
  }

  removeNode(node) {
    this.graph.remove(node);
    this.setState({nodes: this.graph.nodes});
  }

  moveNode(nodeRef, displaceX, displaceY) {
    var node = this.graph.nodes.filter(n => n.id === nodeRef)[0],
        links = this.graph.links.filter(l => l.from === nodeRef || l.to === nodeRef);
    displaceX /= this.scale;
    displaceY /= this.scale;
    var displace = [displaceX, displaceY];
    node.bounds.translate(displace);
    // node.left -= displaceX;
    // node.top -= displaceY;
    links.forEach(l => {
      if (l.from === nodeRef) {
        // l.startX -= displaceX;
        // l.startY -= displaceY;
        l.bounds.start.sub(displace);
      }
      else {
        // l.endX -= displaceX;
        // l.endY -= displaceY;
        l.bounds.end.sub(displace);
      }
      // this.calculateLinkBox(l);
    });
    this.setState({
      nodes: this.graph.nodes,
      links: this.graph.links
    });
  }

  // displaceNode(nodeRef, displacement) {
  //   // TODO:
  //   this.moveNode(nodeRef, displacement.x, displacement.y);
  // }

  addLink(link, nodeElemA, nodeElemB) {
    var //key = this.newKey(),
        nodeKeyA = nodeElemA.dataset.canvasref,
        nodeKeyB = nodeElemB.dataset.canvasref;
    // link = {
    //   key: key,
    //   ref: key,
    //   from: nodeKeyA,
    //   to: nodeKeyB,
    //   canvas: this,
    //   canvasRef: key,
    //   ...link
    // };
    // this.rawLinks.push(link);
    // this.setState({links: this.rawLinks.slice(0)});
    // debugger;
    link.layer = 0;
    link.data.from = nodeKeyA;
    link.data.to = nodeKeyB;
    this.graph.connect(link);
    this.setState({links: this.graph.links});
  }

  removeLink(link) {
    this.graph.disconnect(link);
    this.setState({links: this.graph.links});
    // this.rawLinks = this.rawLinks.filter(l => l.canvasRef !== link.props.canvasRef);
    // this.setState({links: this.rawLinks});
  }

  // marks

  touchWorld(event) {
    event.stopPropagation();
    event.preventDefault();
    var mark = this.getEventCoords(event);
    this.setState(function(currentState) {
      return {marks: currentState.marks.concat([mark])};
    });
  }

  get marks() {
    return this.state.marks;
  }

  get markVectors() {
    return this.marks.map(mark => {
      return <rect
        x={mark.x - 1.45}
        y={mark.y - 1.45}
        width={3}
        height={3}
        fill="rgba(0, 0, 0, 0.5)" />;
    });
  }

  get markElements() {
    return this.marks.map(mark => {
      return <div style={{
        position: 'absolute',
        top: mark.y - 5.25,
        left: mark.x - 5.25,
        width: 10,
        height: 10,
        opacity: 0.5,
        borderRadius: 5,
        background: 'red'
      }} onClick={this.removeMark.bind(this, mark)} />;
    });
  }

  removeMark(mark, event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({marks: this.marks.filter(m => m !== mark)});
  }

}
