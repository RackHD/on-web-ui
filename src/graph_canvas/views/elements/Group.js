// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'src-common/lib/mixin';

import GraphCanvasChildrenHelpers from '../../mixins/GraphCanvasChildrenHelpers';

import generateId from '../../lib/generateId';
import Rectangle from '../../lib/Rectangle';

import GCElementsLayer from '../layers/Elements';
import GCVectorsLayer from '../layers/Vectors';

import Panel from './Panel';

@radium
@mixin(GraphCanvasChildrenHelpers)
export default class GCGroupElement extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    initialBounds: PropTypes.any,
    initialColor: PropTypes.string,
    initialId: PropTypes.string,
    initialName: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    className: 'GCGroupElement',
    css: {},
    initialBounds: [0, 0, 750, 500],
    initialColor: 'grey',
    initialId: null,
    initialName: '(Unamed Group)',
    style: {}
  };

  static contextTypes = {
    graphCanvas: PropTypes.any
  };

  static childContextTypes = {
    graphCanvas: PropTypes.any,
    parentGCGroup: PropTypes.any
  };

  static GCTypeEnum = {element: true, group: true, panel: true};

  static id() { return generateId('group'); }

  get graphCanvas() { return this.context.graphCanvas; }

  get graphCanvasViewport() { return this.graphCanvas.refs.viewport; }

  id = this.props.initialId || this.constructor.id();

  getChildContext() {
    return {
      graphCanvas: this.graphCanvas,
      parentGCGroup: this
    };
  }

  get bounds() {
    return this.refs.panel.state.bounds;
  }

  state = {
    vectors: [],
    elements: []
  };

  render() {
    let vectors = this.state.vectors.slice(0),
        elements = this.state.elements.slice(0),
        children = this.prepareChildren(this, vectors, elements);

    let vectorsBounds = new Rectangle(this.props.initialBounds),
        elementsWidth = vectorsBounds.width - 20;
    // NOTE: 10,49 comes from Panel.js it is based on padding, borders, and the height of the header.
    vectorsBounds.max = vectorsBounds.max.sub([20, 60]);

    return (
      <Panel ref="panel" parent={this} {...this.props}>
        <GCVectorsLayer ref="vectors" key="vectors" bounds={vectorsBounds}>
          {vectors}
        </GCVectorsLayer>

        <GCElementsLayer ref="elements" key="elements" width={elementsWidth}>
          {elements}
        </GCElementsLayer>

        {children}
      </Panel>
    );
  }

  emitters = {add: {}, remove: {}};

  emitLink(link) {
    if (this.emitters.add[link.id]) { return; }
    this.emitters.add[link.id] = true;
    if (this.props.onLink) { this.props.onLink(link); }
    if (this.graphCanvas) { this.graphCanvas.emitLink(link); }
  }

  emitUnlink(link) {
    if (this.emitters.remove[link.id]) { return; }
    this.emitters.remove[link.id] = true;
    if (this.props.onUnlink) { this.props.onUnlink(link); }
    if (this.graphCanvas) { this.graphCanvas.emitUnlink(link); }
  }
}
