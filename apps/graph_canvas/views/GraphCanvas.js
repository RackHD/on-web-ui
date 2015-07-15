'use strict';

import { EventEmitter } from 'events';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import CoordinateHelpers from '../mixins/CoordinateHelpers';

import Graph from '../lib/Graph';
import Vector from '../lib/Vector';
import Rectangle from '../lib/Rectangle';

import GCViewport from './Viewport';
import GCWorld from './World';

import GCGroupsManager from './managers/Groups';
import GCLinksManager from './managers/Links';
import GCMarksManager from './managers/Marks';
import GCNodesManager from './managers/Nodes';

import './GraphCanvas.less';
import GCNodeElement from './elements/Node';
import GCLinkElement from './elements/Link';

/**
# GraphCanvas

@object
  @type class
  @extends React.Component
  @name GraphCanvas
  @desc
*/

@radium
@mixin.decorate(CoordinateHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    css: PropTypes.object,
    enableMarks: PropTypes.bool,
    initialGraph: PropTypes.any,
    initialGroups: PropTypes.any,
    initialLinks: PropTypes.any,
    initialMarks: PropTypes.any,
    initialNodes: PropTypes.any,
    initialScale: PropTypes.number,
    initialX: PropTypes.number,
    initialY: PropTypes.number,
    style: PropTypes.object,
    viewHeight: PropTypes.number,
    viewWidth: PropTypes.number,
    worldHeight: PropTypes.number,
    worldWidth: PropTypes.number
  },
  defaultProps: {
    className: 'GraphCanvas',
    css: {},
    enableMarks: true,
    initialGraph: new Graph(),
    initialGroups: [],
    initialLinks: [],
    initialMarks: [],
    initialNodes: [],
    initialScale: 1,
    initialX: 0,
    initialY: 0,
    style: {},
    viewHeight: 600,
    viewWidth: 800,
    worldHeight: 2000,
    worldWidth: 2000
  },
  childContextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GraphCanvas extends Component {

  get graphCanvas() {
    return this;
  }

  graph = this.props.initialGraph;
  history = []; // TODO: keep track of each action as a separate mutation for undo/redo
  selected = [];

  state = {
    groups: this.props.initialGroups,
    links: this.props.initialLinks,
    marks: this.props.initialMarks,
    nodes: this.props.initialNodes,
    position: new Vector(
      this.props.initialX,
      this.props.initialY
    ),
    scale: this.props.initialScale
  };

  css = {
    root: {
      overflow: 'hidden'
    }
  };

  getChildContext() {
    return {
      graphCanvas: this
    };
  }

  componentWillMount() {
    this.events = new EventEmitter();
  }

  componentWillUnmount() {
    this.events.removeAllListeners();
  }

  /**
  @method
    @name render
    @desc
  */
  render() {
    try {
      var props = this.props,
          css = [this.css.root, this.cssViewSize, props.css.root, props.style];
      return (
        <div className={props.className} style={css}>
          <GCViewport ref="viewport">
            <GCWorld ref="world"
                elements={this.elements}
                vectors={this.vectors}>
              {this.props.children}
            </GCWorld>
          </GCViewport>

          <GCGroupsManager ref="groups" />
          <GCLinksManager ref="links" />
          <GCNodesManager ref="nodes" />
          {this.props.enableMarks && <GCMarksManager ref="marks" />}
        </div>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

  get cssViewSize() {
    return {
      width: this.props.viewWidth,
      height: this.props.viewHeight
    };
  }

  get cssWorldSize() {
    return {
      width: this.props.worldWidth,
      height: this.props.worldHeight
    };
  }

  get elements() {
    var elements = [],
        world = this.refs.world;
    if (world) {
      elements = elements.concat(this.state.nodes.map(node => {
        return <GCNodeElement ref={node.id} key={node.id} model={node} />;
      }));
      if (this.refs.marks) {
        elements = elements.concat(this.refs.marks.markElements);
      }
    }
    return elements;
  }

  get vectors() {
    var vectors = [],
        world = this.refs.world;
    if (world) {
      vectors = vectors.concat(this.state.links.map(link => {
        return <GCLinkElement ref={link.id} key={link.id} model={link} />;
      }));
      if (this.refs.links.activeLink) {
        vectors.push(<GCLinkElement active={true} ref={this.refs.links.activeLink.id} key={this.refs.links.activeLink.id} model={this.refs.links.activeLink} />);
      }
      if (this.refs.marks) {
        vectors = vectors.concat(this.refs.marks.markVectors);
      }
    }
    return vectors;
  }

  updatePosition(position) {
    // this.state.position = position;
    this.setState({ position });
  }

  updateScale(scale) {
    // this.state.scale = scale;
    this.setState({ scale });
  }

  updateGraph(graph) {
    this.graph = graph || this.graph;
    this.setState({nodes: this.graph.nodes});
    console.log(this.graph.nodes);
    setTimeout(() => {
      console.log(this.graph.links);
      this.setState({links: this.fixLinkPositions(this.graph.links)});
    }, 0);
  }

  fixLinkPositions(links) {
    links = links || this.graph.links;
    var getSocketPosition = (link, k) => {
      var socket = link['socket' + k],
          port = socket.port,
          node = port.node;
      var nodeRef = this.refs[node.id],
          portRef = nodeRef.refs[port.name],
          socketRef = portRef.refs[socket.type];
      return this.getSocketCenter(
        React.findDOMNode(socketRef).querySelector('.GraphCanvasSocketIcon')
      );
    };
    console.log('fix links', links.length);
    links.forEach(link => {
      var a = getSocketPosition(link, 'Out'),
          b = getSocketPosition(link, 'In');
      link.data.bounds = new Rectangle(a.x, a.y, b.x, b.y);
    });
    return links;
  }

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

  selectNode(node, shiftKey) {
    this.refs.world.selectNode(node, shiftKey);
  }

  onSelect(callback) {
    this.events.on('selection', callback);
  }

  selectionHandler(selection) {
    this.events.emit('selection', selection);
  }

}
