// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import radium from 'radium';

import generateId from '../../lib/generateId';

import Rectangle from '../../lib/Rectangle';

import Panel from './Panel';

@radium
export default class GCNodeElement extends Component {

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
    className: 'GCNodeElement',
    css: {},
    initialBounds: [50, 50, 350, 350],
    initialColor: 'grey',
    initialId: null,
    initialName: '(Unamed Node)',
    style: {}
  };

  static contextTypes = {
    graphCanvas: PropTypes.any,
    parentGCGroup: PropTypes.any
  };

  static childContextTypes = {
    graphCanvas: PropTypes.any,
    parentGCGroup: PropTypes.any,
    parentGCNode: PropTypes.any
  };

  static GCTypeEnum = {element: true, node: true, panel: true};

  static id() { return generateId('node'); }

  get graphCanvas() { return this.context.graphCanvas; }

  get graphCanvasViewport() { return this.graphCanvas.refs.viewport; }

  get graphCanvasWorld() { return this.graphCanvas.refs.world; }

  get parentGroup() { return this.context.parentGCGroup; }

  id = this.props.initialId || this.constructor.id();

  getChildContext() {
    return {
      graphCanvas: this.graphCanvas,
      parentGCGroup: this.parentGroup,
      parentGCNode: this
    };
  }

  get bounds() {
    return this.refs.panel.state.bounds;
  }

  render() {
    return (
      <Panel ref="panel" parent={this} {...this.props}>
        {this.props.children}
      </Panel>
    );
  }

  emitters = {add: {}, remove: {}};

  emitLink(link) {
    if (this.emitters.add[link.id]) { return; }
    this.emitters.add[link.id] = true;
    if (this.props.onLink) { this.props.onLink(link); }
    if (this.parentGroup) { this.parentGroup.emitLink(link); }
    else if (this.graphCanvas) { this.graphCanvas.emitLink(link); }
  }

  emitUnlink(link) {
    if (this.emitters.remove[link.id]) { return; }
    this.emitters.remove[link.id] = true;
    if (this.props.onUnlink) { this.props.onUnlink(link); }
    if (this.parentGroup) { this.parentGroup.emitUnlink(link); }
    else if (this.graphCanvas) { this.graphCanvas.emitUnlink(link); }
  }

}
