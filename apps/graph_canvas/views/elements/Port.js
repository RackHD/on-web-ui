'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import Color from 'color';

import DragEventHelpers from '../../mixins/DragEventHelpers';

import {} from 'material-ui';

import Rectangle from '../../lib/Rectangle';

import generateId from '../../lib/generateId';

@radium
@mixin.decorate(DragEventHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    css: PropTypes.object,
    initialColor: PropTypes.string,
    initialName: PropTypes.string,
    initialId: PropTypes.string,
    initialSockets: PropTypes.array,
    style: PropTypes.any
  },
  defaultProps: {
    className: 'GCPortElement',
    css: {},
    initialColor: 'black',
    initialName: 'port',
    initialId: null,
    style: null
  },
  contextTypes: {
    graphCanvas: PropTypes.any,
    parentGCNode: PropTypes.any,
    parentGCGroup: PropTypes.any
  }
})
export default class GCPortElement extends Component {

  static GCTypeEnum = {element: true, port: true};

  static id() { return generateId('port'); }

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  get parentNode() {
    return this.context.parentGCNode;
  }

  get parentGroup() {
    return this.context.parentGCGroup;
  }

  get parentElement() {
    return this.parentNode || this.parentGroup;
  }

  id = this.props.initialId || this.constructor.id();

  componentWillMount() {
    this.graphCanvas.register(this);
  }

  componentWillUnmount() {
    this.graphCanvas.unregister(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let state = this.state;
    return (
      state.bounds !== nextState.bounds ||
      state.color !== nextState.color ||
      state.name !== nextState.name
    );
  }

  state = {
    bounds: new Rectangle(this.props.initialBounds),
    color: new Color(this.props.initialColor),
    name: this.props.initialName
  };

  render() {
    // console.log('RENDER PORT');

    let css = this.preparedCSS,
        className = 'ungrid ' + this.props.className,
        leftSockets = [],
        rightSockets = [];

    // console.log(this.props.children, this.state.sockets);

    var sockets = [];

    var children = React.Children.map(this.props.children, child => {
      if (child && child._context) {
        child._context.parentGCPort = this;
      }
      let gcTypeEnum = child && child.type && child.type.GCTypeEnum;
      if (gcTypeEnum && gcTypeEnum.socket) {
        sockets.push(child);
        return null;
      }
      else {
        return child;
      }
    });

    sockets.forEach(socket => {
      if (socket.props.dir[0] === -1) {
        leftSockets.push(socket);
      }
      else if (socket.props.dir[0] === 1) {
        rightSockets.push(socket);
      }
      else {
        console.error(new Error('Invalid socket dir').stack);
      }
    });

    return (
      <div className={className}
           data-id={this.id}
           style={css.root}>
        <div className="line">
          <div className="cell">{leftSockets}</div>
          <div className="cell">
            <span className="name" style={css.name}>{this.state.name}</span>
          </div>
          <div className="cell">{rightSockets}</div>
        </div>
        {children}
      </div>
    );
  }

  css = {
    name: {
      fontSize: '12px',
      lineHeight: '18px'
    },
    root: {
      boxSizing: 'border-box',
      clear: 'both',
      minHeight: 22,
      padding: '2px 0',
      textAlign: 'center',
      borderBottom: '2px dotted #ccc'
    }
  }

  get preparedCSS() {
    let props = this.props,
        color = this.state.color;
    return {
      name: [
        this.css.name,
        {color: color.hexString()},
        props.css.name
      ],
      root: [this.css.root, props.css.root, props.style]
    };
  }

}
