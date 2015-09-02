'use strict';

import { Component } from 'mach-react';

import GSElementsLayer from './ElementsLayer';
import GSVectorsLayer from './VectorsLayer';
import GSViewerElement from './ViewerElement';
import GSInlineFrameElement from './InlineFrameElement';

export default class GSWorld extends Component {

  static defaultProps = {
    className: 'GSWorld',
    css: {},
    elements: [],
    style: {},
    vectors: [],
    viewers: {}
  }

  get canvas() { return this.context.canvas; }

  state = {
    elements: this.props.elements,
    vectors: this.props.vectors,
    viewers: this.props.viewers
  }

  render(React) {
    let viewers = this.state.viewers,
        vectors = this.state.vectors,
        elements = this.state.elements,
        children = this.props.children;

    elements = elements.concat(Object.keys(viewers).map(id => {
      if (id === this.canvas.state.id) return;
      let viewer = viewers[id];
      return <GSViewerElement id={id} position={viewer.position} size={viewer.size} />;
    }));

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
          <GSInlineFrameElement size={[800, 600]} position={[0, 0]} />
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
    this.setState({viewers: viewers});
  }

  upsertViewer(msg) {
    let viewers = this.state.viewers;
    viewers[msg.id] = {
      id: msg.id,
      size: msg.size,
      position: msg.position
    };
    this.setState({viewers: viewers});
  }

  removeViewer(msg) {
    let viewers = this.state.viewers;
    delete viewers[msg.viewer.id];
    this.setState({viewers: viewers});
  }

}
