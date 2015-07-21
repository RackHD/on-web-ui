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
    className: 'GCGroupElement',
    css: {},
    initialBounds: [0, 0, 750, 500],
    initialColor: 'grey',
    initialId: null,
    initialName: '(Unamed Group)',
    style: {}
  },
  contextTypes: {
    graphCanvas: PropTypes.any,
    graphCanvasOwner: PropTypes.any
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

  state = {
    name: this.props.initialName,
    color: this.props.initialColor,
    bounds: new Rectangle(this.props.initialBounds),
    removed: false
  };

  render() {
    if (this.state.removed) { return null; }

    this.prepareChildren();

    // let vectors = [];

    // this.props.children = React.Children.map(this.props.children, child => {
    //   if (!child) { return null; }
    //   if (child.type.GCTypeEnum && child.type.GCTypeEnum.vector) {
    //     if (vectors.indexOf(child) === -1) {
    //       vectors.push(child);
    //       return null;
    //     }
    //   }
    //   return child;
    // });

    return (
      <Panel ref="panel" {...this.props}
          initialId={this.props.initialId || this.id}
          onRemovePanel={this.onRemovePanel.bind(this)}
          onUpdateBounds={null} />
    );
  }

  prepareChildren() {
    React.Children.forEach(this.props.children, child => {
      if (child && child._context) {
        child._context.parentGCGroup = this;
      }
      return child;
    });
  }

  onRemovePanel() {
    this.groupsManager.removePanel(this);
  }

}
