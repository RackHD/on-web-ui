// Copyright 2015, EMC, Inc.

'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

import GCElementsLayer from './layers/Elements';
import GCVectorsLayer from './layers/Vectors';

@radium
@decorate({
  propTypes: {
    className: PropTypes.string,
    css: PropTypes.object,
    elements: PropTypes.array,
    grid: PropTypes.object,
    style: PropTypes.object,
    vectors: PropTypes.array
  },
  defaultProps: {
    className: 'GraphCanvasWorld',
    css: {},
    elements: [],
    grid: {},
    style: {},
    vectors: []
  },
  contextTypes: {
    graphCanvas: PropTypes.any
  },
  childContextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GCWorld extends Component {

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  state = {
    vectors: this.props.vectors,
    elements: this.props.elements
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     vectors: nextProps.vectors,
  //     elements: nextProps.elements
  //   });
  // }

  shouldComponentUpdate() {
    return true;
  }

  getChildContext() {
    return {
      graphCanvas: this.graphCanvas
    };
  }

  render() {
    let graphVectors = this.graphCanvas.vectors,
        graphElements = this.graphCanvas.elements;

    let vectors = graphVectors.concat(this.state.vectors),
        elements = graphElements.concat(this.state.elements),
        children = this.prepareChildren(this, vectors, elements);

    try {
      var cssWorldSpaceTransform = this.cssWorldSpaceTransform,
          cssWorldSize = this.graphCanvas.cssWorldSize;

      return (
        <div
            className={this.props.className}
            onDoubleClick={this.touchWorld.bind(this)}
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
    } catch (err) {
      console.error(err.stack || err);
    }
  }

  get cssWorldSpaceTransform() {
    return {
      transform: this.graphCanvas.worldSpaceTransform.toCSS3Transform()
      // transformOrigin: 'center center 0',
      // transformStyle: 'flat',
      // transformBox: 'border-box'
    };
  }

  prepareChildren(component, vectors, elements) {
    if (!component || !component.props) {
      return component;
    }
    return React.Children.map(component.props.children, child => {
      if (!child) { return null; }
      let gcTypeEnum = child && child.type && child.type.GCTypeEnum;
      if (gcTypeEnum) {
        if (gcTypeEnum.vector) {
          if (vectors.indexOf(child) === -1) {
            vectors.push(React.cloneElement(child));
          }
        }
        else {
          if (elements.indexOf(child) === -1) {
            elements.push(React.cloneElement(child));
          }
        }
        return null;
      }
      // if (child && child.props) {
      //   child.props.children = this.prepareChildren(child, vectors, elements);
      // }
      // return child;
      return React.cloneElement(child, null, this.prepareChildren(child, vectors, elements));
    });
  }

  appendChild(component) {
    let gcTypeEnum = component && component.type &&
      (component.type.GCTypeEnum || component.type.constructor.GCTypeEnum);
    if (!gcTypeEnum) {
      throw new Error('GraphCanvas: Cannot append a child that is not a valid element type.');
    }
    if (gcTypeEnum.vector) {
      this.setState(prevState => {
        let vectors = prevState.vectors.concat([component]);
        return { vectors };
      });
    }
    else {
      this.setState(prevState => {
        let elements = prevState.elements.concat([component]);
        return { elements };
      });
    }
  }

  removeChild(component) {
    let gcTypeEnum = component && component.type &&
      (component.type.GCTypeEnum || component.type.constructor.GCTypeEnum);
    if (!gcTypeEnum) {
      throw new Error('GraphCanvas: Cannot remove a child that is not a valid element type.');
    }
    if (gcTypeEnum.vector) {
      this.setState(prevState => {
        let vectors = prevState.vectors.filter(c => c !== component);
        return { vectors };
      });
    }
    else {
      this.setState(prevState => {
        let elements = prevState.elements.filter(c => c !== component);
        return { elements };
      });
    }
  }

  touchWorld(event) {
    if (this.graphCanvas.refs.marks) {
      this.graphCanvas.refs.marks.markWorld(event);
    }
  }

}
