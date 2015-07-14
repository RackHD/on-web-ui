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

import GCViewport from './Viewport';
import GCWorld from './World';

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

  graph = this.props.initialGraph;

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
      // position: 'relative',
      overflow: 'hidden'
      // width: '100%',
      // height: '100%'
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
                vectors={this.vectors} />
          </GCViewport>
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
    var elements = [];
    if (this.refs.world) {
      elements = elements.concat(this.refs.world.refs.marks.markElements);
    }
    return elements;
  }

  get vectors() {
    var vectors = [];
    if (this.refs.world) {
      vectors = vectors.concat(this.refs.world.refs.marks.markVectors);
    }
    return vectors;
  }

  updatePosition(position) {
    this.state.position = position;
    this.setState({ position });
  }

  updateScale(scale) {
    this.state.scale = scale;
    this.setState({ scale });
  }

  updateGraph() {
    // this.forceUpdate();
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
