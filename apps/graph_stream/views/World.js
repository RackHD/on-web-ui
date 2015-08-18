'use strict';

import { Component } from 'mach-react';

import GSElementsLayer from './ElementsLayer';
import GSVectorsLayer from './VectorsLayer';
import GSViewerElement from './ViewerElement';

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
    let vectors = this.state.vectors,
        elements = this.state.elements,
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

  updateViewers(viewers) {
    let React = this.constructor;
    let viewerElements = [];
    Object.keys(viewers).forEach(id => {
      if (id === this.canvas.state.id) return;
      viewerElements.push(<GSViewerElement id={id} state={viewers[id]} />);
    });
    this.setState({elements: viewerElements});
  }

  addViewer(msg) {
    let React = this.constructor;
    let viewerElements = this.state.elements.concat(<GSViewerElement id={msg.id} state={{
      id: msg.id,
      size: msg.size,
      position: msg.position
    }} />);
    this.setState({elements: viewerElements});
  }

  removeViewer(msg) {
    let React = this.constructor;
    let viewerElements = [];
    this.state.elements.forEach((thunk) => {
      if (thunk && thunk.component && thunk.component.props && thunk.component.props.id === msg.viewer.id) {
        return;
      }
      viewerElements.push(thunk);
    });
    this.setState({elements: viewerElements});
  }

}
