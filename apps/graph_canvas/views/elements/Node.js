'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

import {} from 'material-ui';

import generateId from '../../lib/generateId';

import Rectangle from '../../lib/Rectangle';

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
    className: 'GCNodeElement',
    css: {},
    initialBounds: [0, 0, 750, 500],
    initialColor: 'grey',
    initialId: null,
    initialName: '(Unamed Node)',
    style: {}
  },
  contextTypes: {
    graphCanvas: PropTypes.any,
    graphCanvasOwner: PropTypes.any
  }
})
export default class GCNodeElement extends Component {

  static GCTypeEnum = {element: true, node: true};

  get graphCanvas() { return this.context.graphCanvas; }

  get graphCanvasViewport() { return this.graphCanvas.refs.viewport; }

  get nodesManager() { return this.graphCanvas.refs.nodes; }

  id = this.props.initialId || generateId('node');

  // componentWillMount() {
  //   this.graphCanvas.register(this);
  // }

  // componentWillUnmount() {
  //   this.graphCanvas.unregister(this);
  // }

  // componentDidMount() {
    // this.nodesManager.register(this);
  // }

  shouldComponentUpdate(nextProps, nextState) {
    let state = this.state;
    return (state.bounds !== nextState.bounds);
  }

  state = {
    bounds: new Rectangle(this.props.initialBounds)
  };

  render() {
    console.log('RENDER NODE');
    this.prepareChildren();

    return (
      <Panel ref="panel" {...this.props}
          initialId={this.props.initialId || this.id}
          onRemovePanel={this.onRemovePanel.bind(this)} />
    );
  }

  prepareChildren() {
    React.Children.forEach(this.props.children, child => {
      if (child && child._context) {
        child._context.parentGCNode = this;
      }
      return child;
    });
  }

  onRemovePanel() {
    this.nodesManager.removePanel(this);
  }

}
