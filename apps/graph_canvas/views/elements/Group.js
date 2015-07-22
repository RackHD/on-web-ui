'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

import {} from 'material-ui';

import generateId from '../../lib/generateId';
import Rectangle from '../../lib/Rectangle';

import GCElementsLayer from '../layers/Elements';
import GCVectorsLayer from '../layers/Vectors';

import Panel from './Panel';

@radium
@decorate({
  propTypes: {
    className: PropTypes.string,
    css: PropTypes.object,
    initialBounds: PropTypes.any,
    initialColor: PropTypes.string,
    initialId: PropTypes.string,
    initialName: PropTypes.string,
    style: PropTypes.object
  },
  defaultProps: {
    className: 'GCGroupElement',
    css: {},
    initialBounds: [0, 0, 750, 500],
    initialColor: 'grey',
    initialId: null,
    initialName: '(Unamed Group)',
    style: {}
  },
  contextTypes: {
    graphCanvas: PropTypes.any
    // graphCanvasOwner: PropTypes.any
  }
})
export default class GCGroupElement extends Component {

  static GCTypeEnum = {element: true, group: true};

  get graphCanvas() { return this.context.graphCanvas; }

  get graphCanvasViewport() { return this.graphCanvas.refs.viewport; }

  // get groupsManager() { return this.graphCanvas.refs.groups; }

  // get nodesManager() { return this.graphCanvas.refs.nodes; }

  // get linkManager() { return this.graphCanvas.refs.links; }

  id = this.props.initialId || generateId('group');

  // componentDidMount() { this.groupsManager.register(this); }

  shouldComponentUpdate(nextProps, nextState) {
    let state = this.state;
    return (state.bounds !== nextState.bounds);
  }

  state = {
    bounds: new Rectangle(this.props.initialBounds)
  };

  render() {
    console.log('RENDER GROUP');

    let vectors = [],
        elements = this.prepareChildren(vectors),
        vectorsBounds = this.state.bounds.clone(),
        elementsWidth = vectorsBounds.width - 10;
    // NOTE: 10,49 comes from Panel.js it is based on padding, borders, and the height of the header.
    vectorsBounds.max = vectorsBounds.max.sub([10, 49]);

    return (
      <Panel ref="panel" {...this.props}
          initialId={this.props.initialId || this.id}
          onRemovePanel={this.onRemovePanel.bind(this)}
          onUpdateBounds={this.onUpdateBounds.bind(this)}>
        <GCVectorsLayer ref="vectors" bounds={vectorsBounds}>
          {vectors}
        </GCVectorsLayer>
        <GCElementsLayer ref="elements" width={elementsWidth}>
          {elements}
        </GCElementsLayer>
      </Panel>
    );
  }

  prepareChildren(vectors) {
    React.Children.forEach(this.props.children, child => {
      if (child && child._context) {
        child._context.parentGCGroup = this;
      }
      return child;
    });
    return this.hoistVectorChildren(this, vectors);
  }

  hoistVectorChildren(component, vectors) {
    if (!component || !component.props) {
      return component;
    }
    return React.Children.map(component.props.children, child => {
      if (!child) { return null; }
      let gcTypeEnum = child && child.type && child.type.GCTypeEnum;
      if (gcTypeEnum && gcTypeEnum.vector) {
        if (vectors.indexOf(child) === -1) { vectors.push(child); }
        return null;
      }
      if (child && child.props && (!gcTypeEnum || !gcTypeEnum.group)) {
        child.props.children = this.hoistVectorChildren(child, vectors);
      }
      return child;
    });
  }

  onRemovePanel() {
    this.groupsManager.removePanel(this);
  }

  onUpdateBounds(bounds) {
    this.setState({ bounds });
  }

}
