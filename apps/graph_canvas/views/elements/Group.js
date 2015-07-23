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
    return (
      state.bounds !== nextState.bounds ||
      state.vectors !== nextState.vectors ||
      state.elements !== nextState.elements
    );
  }

  state = {
    bounds: new Rectangle(this.props.initialBounds),
    vectors: [],
    elements: []
  };

  render() {
    // console.log('RENDER GROUP');

    let vectors = this.state.vectors.slice(0),
        elements = this.state.elements.slice(0),
        children = this.prepareChildren(this, vectors, elements),
        vectorsBounds = this.state.bounds.clone(),
        elementsWidth = vectorsBounds.width - 10;
    // NOTE: 10,49 comes from Panel.js it is based on padding, borders, and the height of the header.
    vectorsBounds.max = vectorsBounds.max.sub([10, 49]);

    return (
      <Panel ref="panel" {...this.props}
          initialId={this.props.initialId || this.id}
          onRemovePanel={this.onRemovePanel.bind(this)}
          onUpdateBounds={this.onUpdateBounds.bind(this)}>

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

  prepareChildren(component, vectors, elements) {
    if (!component || !component.props) {
      return component;
    }
    return React.Children.map(component.props.children, child => {
      if (!child) { return null; }
      if (child._context) {
        child._context.parentGCGroup = this;
      }
      let gcTypeEnum = child && child.type && child.type.GCTypeEnum;
      if (gcTypeEnum) {
        if (gcTypeEnum.vector) {
          if (vectors.indexOf(child) === -1) { vectors.push(child); }
        }
        else {
          if (elements.indexOf(child) === -1) { elements.push(child); }
        }
        return null;
      }
      if (child && child.props) {
        child.props.children = this.prepareChildren(child, vectors, elements);
      }
      return child;
    });
  }

  appendChild(component) {
    let gcTypeEnum = component && component.type && component.type.GCTypeEnum;
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
    let gcTypeEnum = component && component.type && component.type.GCTypeEnum;
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

  onRemovePanel() {
    this.graphCanvas.unregister(this)
    this.groupsManager.unregister(this);
    // TODO: unregister child elements and links
    // TODO: actually remove from this.parentComponent
  }

  onUpdateBounds(bounds) {
    this.setState({ bounds });
  }

}
