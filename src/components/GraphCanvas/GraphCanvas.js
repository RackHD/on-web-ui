'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import GraphCanvasLink from './GraphCanvasLink';
import GraphCanvasNode from './GraphCanvasNode';
import './GraphCanvas.less';

export default class GraphCanvas extends Component {

  state = {
    node: null,
    link: null,
    nodes: [],
    links: []
  };

  nodes = [];
  links = [];

  nodeX = null;
  nodeY = null;
  linkX = null;
  linkY = null;
  linkFromNode = null;

  drawContinue = this.drawContinue.bind(this);
  drawFinish = this.drawFinish.bind(this);

  drawNodeStart = this.drawNodeStart.bind(this);
  drawNodeContinue = this.drawNodeContinue.bind(this);
  drawNodeFinish = this.drawNodeFinish.bind(this);

  drawLinkStart = this.drawLinkStart.bind(this);
  drawLinkContinue = this.drawLinkContinue.bind(this);
  drawLinkFinish = this.drawLinkFinish.bind(this);

  // Window events

  componentDidMount() {
    // window.addEventListener('mousemove', this.drawContinue);
    // window.addEventListener('mouseup', this.drawFinish);
  }

  componentWillUnmount() {
    // window.removeEventListener('movemove', this.drawContinue);
    // window.removeEventListener('moveup', this.drawFinish);
  }

  // RENDER

  render() {
    var active = null;
    if (this.state.node) {
      active = <div className="node"
                    style={{...this.state.node}}
                    onMouseMove={this.drawNodeContinue}>{Date.now()}</div>;
    }
    if (this.state.link) {
      active = <div className="link"
                    style={{...this.state.link}}
                    onMouseMove={this.drawLinkContinue}>{Date.now()}</div>;
    }
    var links = this.state.links.map(link => <GraphCanvasLink {...link} />),
        nodes = this.state.nodes.map(node => <GraphCanvasNode {...node} />);
    return (
      <div className="GraphCanvas container"
           onMouseDown={this.drawNodeStart}
           onMouseMove={this.drawContinue}
           onMouseUp={this.drawFinish}>
        {links}
        {nodes}
        {active}
      </div>
    );
  }

  // DOM helpers

  getDOMNode() {
    return React.findDOMNode(this);
  }

  offsetXY(element) {
    var x = 0, y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while(element);
    return { x, y };
  }

  delegatesTo(element, className) {
    if (!element) { return false; }
    if (element.classList && element.classList.contains(className)) { return element; }
    return this.delegatesTo(element.parentNode, className);
  }

  // Combo events

  drawContinue(event) {
    if (this.state.link) { this.drawLinkContinue(event); }
    else { this.drawNodeContinue(event); }
  }

  drawFinish(event) {
    if (this.state.link && this.linkFromNode) {
      this.drawLinkFinish(event);
    }
    if (this.nodeX || this.nodeY) {
      this.drawNodeFinish(event);
    }
  }

  // Node events

  drawNodeStart(event) {
    this.isDrawing = true;
    var e = event.nativeEvent || event,
        o = this.offsetXY(this.getDOMNode()),
        x = e.pageX || e.clientX,
        y = e.pageY || e.clientY;
    x -= o.x;
    y -= o.y;
    e.stopPropagation();
    this.nodeX = x;
    this.nodeY = y;
  }

  drawNodeContinue(event) {
    if (!this.isDrawing || this.state.link) { return; }
    var e = event.nativeEvent || event,
        o = this.offsetXY(this.getDOMNode()),
        x = e.pageX || e.clientX,
        y = e.pageY || e.clientY,
        node = {};
    e.stopPropagation();
    x -= o.x;
    y -= o.y;
    if (x < this.nodeX) {
      node.left = x;
      node.width = this.nodeX - x;
    } else {
      node.left = this.nodeX;
      node.width = x - this.nodeX;
    }
    if (y < this.nodeY) {
      node.top = y;
      node.height = this.nodeY - y;
    }
    else {
      node.top = this.nodeY;
      node.height = y - this.nodeY;
    }
    if (node.width * node.width < 500) {
      this.setState({node: null});
    }
    else {
      this.setState({node: node});
    }
  }

  drawNodeFinish(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
    this.isDrawing = false;
    this.nodeX = null;
    this.nodeY = null;
    if (this.state.node && this.state.node.width) {
      this.addNode(this.state.node);
      this.setState({node: null});
    }
  }

  // Link events

  drawLinkStart(event) {
    this.isDrawing = true;
    var e = event.nativeEvent || event,
        o = this.offsetXY(this.getDOMNode()),
        x = e.pageX || e.clientX,
        y = e.pageY || e.clientY;
    x -= o.x;
    y -= o.y;
    e.stopPropagation();
    this.linkX = x;
    this.linkY = y;
    this.linkFromNode = this.delegatesTo(e.target, 'GraphCanvasNode');
  }

  drawLinkContinue(event) {
    if (!this.isDrawing || this.state.node) { return; }
    var e = event.nativeEvent || event,
        o = this.offsetXY(this.getDOMNode()),
        x = e.pageX || e.clientX,
        y = e.pageY || e.clientY,
        link = {
          startX: this.linkX,
          startY: this.linkY,
          endX: x,
          endY: y,
          dirX: 1,
          dirY: 1
        };
    e.stopPropagation();
    x -= o.x;
    y -= o.y;
    if (x < this.linkX) {
      link.left = x;
      link.width = this.linkX - x;
      link.dirX = -1;
    } else {
      link.left = this.linkX;
      link.width = x - this.linkX;
    }
    if (y < this.linkY) {
      link.top = y;
      link.height = this.linkY - y;
    }
    else {
      link.top = this.linkY;
      link.height = y - this.linkY;
      link.dirY = -1;
    }
    this.setState({link: link});
  }

  drawLinkFinish(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
    this.isDrawing = false;
    this.linkX = null;
    this.linkY = null;
    var isTargetNode = this.delegatesTo(e.target, 'GraphCanvasNode');
    if (this.state.link && this.state.link.width && isTargetNode && isTargetNode !== this.linkFromNode) {
      this.addLink(this.state.link, this.linkFromNode, isTargetNode);
    }
    this.linkFromNode = null;
    this.setState({link: null});
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
    this.nodes.push(node);
    this.setState({nodes: this.nodes.slice(0)});
  }

  removeNode(node) {
    this.nodes = this.nodes.filter(n => n.canvasRef !== node.props.canvasRef);
    this.setState({nodes: this.nodes});
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
    this.links.push(link);
    this.setState({links: this.links.slice(0)});
  }

  removeLink(link) {
    this.links = this.links.filter(l => l.canvasRef !== link.props.canvasRef);
    this.setState({links: this.links});
  }

}
