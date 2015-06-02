'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
import StyleHelpers from 'common-web-ui/mixins/StyleHelpers';
import DragEventHelpers from './mixins/DragEventHelpers';
/* eslint-enable no-unused-vars */

import Vector from './lib/Vector';
import Matrix from './lib/Matrix';
import Rectangle from './lib/Rectangle';
import GraphCanvasLink from './GraphCanvasLink';
import GraphCanvasNode from './GraphCanvasNode';
import './GraphCanvas.less';

@decorateComponent({
  propTypes: {
    worldWidth: PropTypes.number,
    worldHeight: PropTypes.number,
    screenWidth: PropTypes.number,
    screenHeight: PropTypes.number,
    initialNodes: PropTypes.array,
    initialLinks: PropTypes.array
  },
  defaultProps: {
    worldWidth: 500,
    worldHeight: 500,
    screenWidth: 1000,
    screenHeight: 1000,
    initialNodes: [],
    initialLinks: []
  }
})
@mixin.decorate(DragEventHelpers)
@mixin.decorate(StyleHelpers)
export default class GraphCanvas extends Component {

  state = {
    screenPosition: new Vector(0, 0),
    scale: 1,
    node: null,
    link: null,
    nodes: [],
    links: []
  };
  rawNodes = [];
  rawLinks = [];

  render() { try {
    var //scale = this.scale,
        screenSize = this.screenSize,
        worldSize = this.worldSize,
        worldBoundingBox = this.worldBoundingBox,
        worldSpaceTransform = this.worldSpaceTransform.translate(this.screenPosition),
        css3WorldSpaceTransform = worldSpaceTransform.toCSS3Transform(),
        // worldPosition = this.worldPosition,
        activeNode = this.state.node && <GraphCanvasNode
          active={true}
          canvas={this}
          {...this.state.node}
        />,
        activeLink = this.state.link && <GraphCanvasLink
          active={true}
          canvas={this}
          {...this.state.link}
        />,
        links = this.state.links.map(link => <GraphCanvasLink {...link} />),
        nodes = this.state.nodes.map(node => <GraphCanvasNode {...node} />);
    console.log('WBB', worldBoundingBox.toSVGViewBox());
    return (
      <div className="GraphCanvas"
           onMouseDown={this.translateCanvas()}
           onContextMenu={this.drawNode()}
           onWheel={this.scaleCanvas.bind(this)}
           style={{
             width: screenSize.x,
             height: screenSize.y
           }}>
        <div className="links container"
             style={this.mergeAndPrefix({
               transform: css3WorldSpaceTransform//'scale(' + scale + ') ' + worldPosition.toCSS3Transform()
             })}>
          <svg
              width={worldBoundingBox.width}
              height={worldBoundingBox.height}
              viewBox={'0 0 ' + worldSize.toArray().join(' ')||worldBoundingBox.toSVGViewBox()}
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10 10 10 Z" fill="none" stroke="#ddd" strokeWidth="0.25"/>
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" x="0" y="0" fill="url(#smallGrid)"/>
                <path d="M 100 0 L 0 0 0 100 100 100 Z" fill="none" stroke="#bbb" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width={worldBoundingBox.width}
                  height={worldBoundingBox.height}
                  x={0}
                  y={0}
                  fill="url(#grid)" />
            {links}
          </svg>
          {activeLink}
        </div>
        <div className="nodes container"
             style={{
               transform: css3WorldSpaceTransform//'scale(' + scale + ') ' + worldPosition.toCSS3Transform()
             }}>
          {nodes}
          {activeNode}
        </div>
      </div>
    );
  } catch (err) { console.error(err.stack || err); } }

  // Coordinates

  get scale() {
    return this.state.scale;
  }

  get screenPosition() {
    return new Vector(this.state.screenPosition);
  }

  get worldPosition() {
    return new Vector(this.state.screenPosition).transform(this.worldSpaceTransform);
  }

  get screenSize() {
    return new Vector(this.props.screenWidth, this.props.screenHeight);
  }

  get worldSize() {
    return new Vector(this.props.worldWidth, this.props.worldHeight);
  }

  get viewBoundingBox() {
    return this.screenBoundingBox.transform(this.worldSpaceTransform);
  }

  get screenBoundingBox() {
    var screenSize = this.screenSize;
    return new Rectangle(0, 0, screenSize.x, screenSize.y);
  }

  get worldBoundingBox() {
    var worldSize = this.worldSize;
    return new Rectangle().setWorld(worldSize.x, -worldSize.y);
  }

  get worldSpaceTransform() {
    var s = this.scale;
    // console.log(this.screenSize);
    return new Matrix().
      identity().
      translate(this.screenSize.div([2, 2]).add(this.worldSize.div([2, 2]).negate())).
      // translate();
      scale([s, s]);
  }

  get screenSpaceTransform() {
    return this.worldSpaceTransform.invert();
  }

  // Canvas events

  translateCanvas() {
    return this.setupClickDrag({
      down: (event, dragState) => {
        if (event.shiftKey) {
          this.drawNode(null, {shiftKey: (dragState.shiftKey = true)})(event);
        }
        if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
        // var scale = this.state.scale;
        dragState.start = new Vector(this.state.screenPosition);
        // TODO: fix these clamps
        dragState.min = new Vector(-1000, -1000);
          // (this.worldBoundingBox.left / 2) - (this.screenSize.x / 2 / scale),
          // (this.worldBoundingBox.top / 2) - (this.screenSize.y / 2 / scale)
        // );
        dragState.max = new Vector(1000, 1000);
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
        this.setState({
          screenPosition: {
            x: Math.min(max.x, Math.max(min.x, start.x + (event.diffX / scale))),
            y: Math.min(max.y, Math.max(min.y, start.y + (event.diffY / scale)))
          }
        });
      },
      up: (event, dragState) => {
        if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
      }
    });
  }

  scaleCanvas(event) {
    event.stopPropagation();
    event.preventDefault();
    this.offsetEventXY(event);
    var scale = this.scale,
        // screenPosition = this.screenPosition,
        // mousePosition = new Vector(event.relX, event.relY),
        force = Math.max(0.1, scale / 5);
    // console.log(event.deltaY);
    if (event.deltaY < 0) {
      scale = Math.max(0.5, scale - force);
    }
    else {
      scale = Math.min(5, scale + force);
    }
    // console.log(this.viewBoundingBox);
    this.setState({ scale });
  }

  // Node events

  drawNode() {
    return this.setupClickDrag({
      down: (event) => {
        event.stopPropagation();
        event.preventDefault();
        // console.log(event.relX, event.relY);
        // var worldCoords = new Vector(event.relX, event.relY),
        //     screenSize = new Vector(this.props.screenWidth, this.props.screenHeight),
        //     worldSize = new Vector(this.props.worldWidth, this.props.worldHeight),
        //     ratio = screenSize.div(worldSize),
        // worldCoords = worldCoords.div(ratio);
        // console.log('wc', worldCoords.toArray(), ratio, worldSize, screenSize);
        // console.log(this.state.screenPosition.toArray(), this.state.scale);
      },
      move: (event, dragState) => {
        if (this.state.link) { return; }
        event.stopPropagation();
        var node = {
          startX: dragState.downEvent.relX,
          startY: dragState.downEvent.relY,
          endX: event.relX,
          endY: event.relY
        };
        this.calculateNodeBox(node);
        this.setState({
          node: (node.height < 50 || node.width < 50) ? null : node
        });
      },
      up: (event) => {
        event.stopPropagation();
        var node = this.state.node;
        this.setState({node: null});
        if (node) {
          node.width = Math.max(node.width, 200);
          node.height = Math.max(node.height, 180);
          this.addNode(node);
        }
      }
    });
  }

  // Link events

  drawLinkStart(event, dragState, e) {
    event.stopPropagation();
    dragState.fromNode = this.delegatesTo(e.target, 'GraphCanvasNode');
  }

  drawLinkContinue(event, dragState) {
    if (this.state.node) { return; }
    event.stopPropagation();
    dragState.link = {
      startX: dragState.downEvent.relX,
      startY: dragState.downEvent.relY,
      endX: event.relX,
      endY: event.relY,
      dirX: 1,
      dirY: 1
    };
    this.calculateLinkBox(dragState.link);
    this.setState({link: dragState.link});
  }

  drawLinkFinish(event, dragState, e) {
    event.stopPropagation();
    var isTargetNode = this.delegatesTo(e.target, 'GraphCanvasNode');
    console.log(isTargetNode !== dragState.fromNode, isTargetNode);
    if (dragState.link && isTargetNode && isTargetNode !== dragState.fromNode) {
      this.addLink(dragState.link, dragState.fromNode, isTargetNode);
    }
    this.linkFromNode = null;
    this.setState({link: null});
  }

  // Box calculations

  calculateNodeBox(node) {
    if (node.endX < node.startX) {
      node.left = node.endX;
      node.width = node.startX - node.endX;
    } else {
      node.left = node.startX;
      node.width = node.endX - node.startX;
    }
    if (node.endY < node.startY) {
      node.top = node.endY;
      node.height = node.startY - node.endY;
    }
    else {
      node.top = node.startY;
      node.height = node.endY - node.startY;
    }
  }

  calculateLinkBox(link) {
    if (link.endX < link.startX) {
      link.left = link.endX;
      link.width = link.startX - link.endX;
      link.dirX = -1;
    }
    else {
      link.left = link.startX;
      link.width = link.endX - link.startX;
      link.dirX = 1;
    }
    if (link.endY < link.startY) {
      link.top = link.endY;
      link.height = link.startY - link.endY;
      link.dirY = 1;
    }
    else {
      link.top = link.startY;
      link.height = link.endY - link.startY;
      link.dirY = -1;
    }
  }

  // List management

  newKey() {
    return Math.round(Math.random() * 1000 + Date.now()).toString(32);
  }

  addNode(node) {
    var key = this.newKey();
    node = {
      key: key,
      ref: key,
      canvas: this,
      canvasRef: key,
      ...node
    };
    this.rawNodes.push(node);
    this.setState({nodes: this.rawNodes.slice(0)});
  }

  removeNode(node) {
    this.rawNodes = this.rawNodes.filter(n => n.canvasRef !== node.props.canvasRef);
    this.setState({nodes: this.rawNodes});
  }

  moveNode(nodeRef, displaceX, displaceY) {
    var node = this.rawNodes.filter(n => n.canvasRef === nodeRef)[0],
        links = this.rawLinks.filter(l => l.from === nodeRef || l.to === nodeRef);
    node.left -= displaceX;
    node.top -= displaceY;
    links.forEach(l => {
      if (l.from === nodeRef) {
        l.startX -= displaceX;
        l.startY -= displaceY;
      }
      else {
        l.endX -= displaceX;
        l.endY -= displaceY;
      }
      this.calculateLinkBox(l);
    });
    this.setState({
      nodes: this.rawNodes.slice(0),
      links: this.rawLinks.slice(0)
    });
  }

  displaceNode(nodeRef, displacement) {
    // TODO:
    this.moveNode(nodeRef, displacement.x, displacement.y);
  }

  addLink(link, nodeElemA, nodeElemB) {
    var key = this.newKey(),
        nodeKeyA = nodeElemA.dataset.canvasref,
        nodeKeyB = nodeElemB.dataset.canvasref;
    link = {
      key: key,
      ref: key,
      from: nodeKeyA,
      to: nodeKeyB,
      canvas: this,
      canvasRef: key,
      ...link
    };
    this.rawLinks.push(link);
    this.setState({links: this.rawLinks.slice(0)});
  }

  removeLink(link) {
    this.rawLinks = this.rawLinks.filter(l => l.canvasRef !== link.props.canvasRef);
    this.setState({links: this.rawLinks});
  }

}
