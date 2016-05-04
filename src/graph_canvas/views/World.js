// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'src-common/lib/mixin';

import GraphCanvasChildrenHelpers from '../mixins/GraphCanvasChildrenHelpers';

import GCElementsLayer from './layers/Elements';
import GCVectorsLayer from './layers/Vectors';

@radium
@mixin(GraphCanvasChildrenHelpers)
export default class GCWorld extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    elements: PropTypes.array,
    grid: PropTypes.object,
    style: PropTypes.object,
    vectors: PropTypes.array
  };

  static defaultProps = {
    className: 'GraphCanvasWorld',
    css: {},
    elements: [],
    grid: {},
    style: {},
    vectors: []
  };

  static contextTypes = {
    graphCanvas: PropTypes.any
  };

  static childContextTypes = {
    graphCanvas: PropTypes.any
  };

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  getChildContext() {
    return {
      graphCanvas: this.graphCanvas
    };
  }

  state = {
    vectors: [],
    elements: []
  };

  render() {
    let vectors = this.state.vectors.slice(0),
        elements = this.state.elements.slice(0),
        children = this.prepareChildren(this, vectors, elements);

    let cssWorldSpaceTransform = this.cssWorldSpaceTransform,
        cssWorldSize = this.graphCanvas.cssWorldSize;

    return (
      <div
          className={this.props.className}
          style={[cssWorldSize, cssWorldSpaceTransform]}>

        <GCVectorsLayer ref="vectors" key="vectors" grid={this.props.grid}>
          {vectors}
        </GCVectorsLayer>

        <GCElementsLayer ref="elements" key="elements" width={null}>
          {elements}
        </GCElementsLayer>

        {children}
      </div>
    );
  }

  get cssWorldSpaceTransform() {
    return {
      transform: this.graphCanvas.worldSpaceTransform.toCSS3Transform()
      // transformOrigin: 'center center 0',
      // transformStyle: 'flat',
      // transformBox: 'border-box'
    };
  }

}
