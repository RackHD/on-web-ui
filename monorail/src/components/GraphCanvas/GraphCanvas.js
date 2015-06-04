'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
import StyleHelpers from 'common-web-ui/mixins/StyleHelpers';
import DragEventHelpers from './mixins/DragEventHelpers';
import CoordinateHelpers from './mixins/CoordinateHelpers';
/* eslint-enable no-unused-vars */

// import Vector from './lib/Vector';
// import Matrix from './lib/Matrix';
// import Rectangle from './lib/Rectangle';
import GraphCanvasView from './GraphCanvasView';
// import GraphCanvasGrid from './GraphCanvasGrid';
// import GraphCanvasLink from './GraphCanvasLink';
// import GraphCanvasNode from './GraphCanvasNode';
import './GraphCanvas.less';

@decorateComponent({
  propTypes: {
    worldWidth: PropTypes.number,
    worldHeight: PropTypes.number,
    viewWidth: PropTypes.number,
    viewHeight: PropTypes.number,
    initialNodes: PropTypes.array,
    initialLinks: PropTypes.array
  },
  defaultProps: {
    worldWidth: 1000,
    worldHeight: 1000,
    viewWidth: 1000,
    viewHeight: 1000,
    initialNodes: [],
    initialLinks: []
  }
})
@mixin.decorate(CoordinateHelpers)
@mixin.decorate(DragEventHelpers)
@mixin.decorate(StyleHelpers)
export default class GraphCanvas extends Component {

  state = {
    activeNode: null,
    activeLink: null,
    nodes: [],
    links: []
  };
  rawNodes = [];
  rawLinks = [];

  render() { try {
    var viewSize = this.viewSize,
        worldSize = this.worldSize,
        cssViewSize = {
          width: viewSize.x,
          height: viewSize.y
        };
    // var activeNode = this.state.node &&
    //       <GraphCanvasNode active={true} canvas={this} {...this.state.node} />,
    //     activeLink = this.state.link &&
    //       <GraphCanvasLink active={true} canvas={this} {...this.state.link} />,
    //     links = this.state.links.map(link => <GraphCanvasLink {...link} />),
    //     nodes = this.state.nodes.map(node => <GraphCanvasNode {...node} />);
    /*
      {links}
      {activeLink}
      {nodes}
      {activeNode}
    */
    return (
      <div
          className="GraphCanvas"
          onContextMenu={this.drawNode()}
          style={cssViewSize}>
        <GraphCanvasView
            ref="view"
            worldWidth={worldSize.x}
            worldHeight={worldSize.y}
            viewWidth={viewSize.x}
            viewHeight={viewSize.y} />
      </div>
    );
  } catch (err) { console.error(err.stack || err); } }

  // Node events

  drawNode() {
    return this.setupClickDrag({
      down: (event) => {
        event.stopPropagation();
        event.preventDefault();
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
