'use strict';

import { Component } from 'mach-react';

import GSElementsLayer from './ElementsLayer';
import GSVectorsLayer from './VectorsLayer';

export default class GSWorld extends Component {

  static defaultProps = {
    className: 'GSWorld',
    css: {},
    elements: [],
    style: {},
    vectors: []
  }

  get canvas() { return this.context.canvas; }

  state = {
    vectors: this.props.vectors,
    elements: this.props.elements
  }

  render(React) {
    let graphVectors = this.canvas.vectors,
        graphElements = this.canvas.elements;

    let vectors = graphVectors.concat(this.state.vectors),
        elements = graphElements.concat(this.state.elements),
        children = this.props.children;

    try {
      var cssWorldSpaceTransform = this.cssWorldSpaceTransform,
          cssWorldSize = this.canvas.cssWorldSize;
      return (
        <div
            className={this.props.className}
            style={[cssWorldSize, cssWorldSpaceTransform]}>

          <GSVectorsLayer ref="vectors" key="vectors" grid={{}}>
            {vectors}
          </GSVectorsLayer>

          <GSElementsLayer ref="elements" key="elements" width={null}>
            {elements}
          </GSElementsLayer>

          {children}
        </div>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

  get cssWorldSpaceTransform() {
    return {
      transform: this.canvas.worldSpaceTransform.toCSS3Transform()
    };
  }

}
