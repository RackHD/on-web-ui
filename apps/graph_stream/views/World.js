// Copyright 2015, EMC, Inc.

'use strict';

import { Component } from 'mach-react';

import GSElementsLayer from './ElementsLayer';
import GSVectorsLayer from './VectorsLayer';
import GSViewerElement from './ViewerElement';
import GSEntityElement from './EntityElement';

export default class GSWorld extends Component {

  static defaultProps = {
    className: 'GSWorld',
    css: {},
    elements: [],
    entities: [],
    style: {},
    vectors: [],
    viewers: {}
  }

  get canvas() { return this.context.canvas; }

  state = {
    elements: this.props.elements,
    entities: this.props.entities,
    vectors: this.props.vectors,
    viewers: this.props.viewers
  }

  render(React) {
    let children = this.props.children,
        elements = this.state.elements,
        entities = this.state.entities,
        vectors = this.state.vectors,
        viewers = this.state.viewers;

    elements = Object.keys(viewers).map(id => {
      if (id === this.canvas.state.id) return;
      let viewer = viewers[id];
      return <GSViewerElement id={id} position={viewer.position} size={viewer.size} />;
    }).concat(elements);

    elements = elements.concat(Object.keys(entities).map(id => {
      let entity = entities[id];
      return <GSEntityElement id={id} position={entity.position} size={entity.size} params={entity.params} />;
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

  updateList(collection, items) {
    this.setState({[collection]: items});
  }

  upsertItem(msg) {
    let collection = this.state[msg.collection];
    collection[msg.id] = msg.item;
    this.updateList(msg.collection, collection);
  }

  removeItem(msg) {
    let collection = this.state[msg.collection];
    delete collection[msg.id];
    this.updateList(msg.collection, collection);
  }

}
