// Copyright 2015, EMC, Inc.

'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

import Vector from '../../lib/Vector';
import Rectangle from '../../lib/Rectangle';

import GCGridElement from '../elements/Grid';

@radium
@decorate({
  propTypes: {
    bounds: PropTypes.object,
    className: PropTypes.string,
    css: PropTypes.object,
    grid: PropTypes.object,
    style: PropTypes.object
  },

  defaultProps: {
    bounds: null,
    className: 'GraphCanvasVectorsLayer',
    css: {},
    grid: null,
    style: {}
  },

  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GCVectorsLayer extends Component {

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  componentWillReceiveProps(nextProps) {
    // console.log('NEW PROPS FOR VECTORS');
    this.setState({
      bounds: nextProps.bounds,
      grid: nextProps.grid
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    let state = this.state,
        props = this.props;
    if (!state.bounds && !nextState.bounds) {
      // console.log('YES!!!');
      return true;
    }
    let result = (
      props.children !== nextProps.children ||
      state.bounds !== nextState.bounds || //!nextState.bounds ||
      state.grid !== nextState.grid
    );
    // console.log('UPDATE VECTORS?', result);
    return result;
  }

  state = {
    bounds: this.props.bounds,
    grid: this.props.grid
  }

  render() {
    // console.log('RENDER VECTORS');

    try {
      let props = this.props,
          bounds = this.state.bounds,
          size = this.graphCanvas.worldSize,
          cssSize = this.graphCanvas.cssWorldSize,
          boundingBox = this.graphCanvas.worldBoundingBox,
          grid = null;

      if (this.state.grid) {
        grid = <GCGridElement {...this.state.grid} />;
      }

      if (bounds) {
        size = new Vector(bounds.width, bounds.height);
        cssSize = {width: size.x, height: size.y};
        boundingBox = new Rectangle(0, 0, size.x, size.y);
      }

      return (
        <svg
            className={props.className}
            width={size.x}
            height={size.y}
            style={[cssSize, {
              overflow: 'visible',
              position: 'absolute',
              left: 0,
              top: 0
            }]}
            viewBox={boundingBox.toSVGViewBox()}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg">
          {grid}
          {props.children}
        </svg>
      );
    }

    catch (err) {
      console.error(err.stack || err);
    }
  }

}
