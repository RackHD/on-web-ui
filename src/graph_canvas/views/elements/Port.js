// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'src-common/lib/mixin';

import Color from 'color';

import DragEventHelpers from '../../mixins/DragEventHelpers';

import Rectangle from '../../lib/Rectangle';

import generateId from '../../lib/generateId';

@radium
@mixin(DragEventHelpers)
export default class GCPortElement extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    initialColor: PropTypes.string,
    initialName: PropTypes.string,
    initialId: PropTypes.string,
    initialSockets: PropTypes.array,
    onLink: PropTypes.func,
    onUnlink: PropTypes.func,
    style: PropTypes.any
  };

  static defaultProps = {
    className: 'GCPortElement',
    css: {},
    initialColor: 'black',
    initialName: 'port',
    initialId: null,
    onLink: null,
    onUnlink: null,
    style: null
  };

  static contextTypes = {
    graphCanvas: PropTypes.any,
    parentGCNode: PropTypes.any,
    parentGCGroup: PropTypes.any
  };

  static childContextTypes = {
    graphCanvas: PropTypes.any,
    parentGCNode: PropTypes.any,
    parentGCGroup: PropTypes.any,
    parentGCPort: PropTypes.any
  };

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

  getChildContext() {
    return {
      graphCanvas: this.graphCanvas,
      parentGCGroup: this.parentGroup,
      parentGCNode: this.parentNode,
      parentGCPort: this
    };
  }

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

    let sockets = [];

    let children = React.Children.map(this.props.children, child => {
      child = React.cloneElement(child);
      let gcTypeEnum = child && child.type && child.type.GCTypeEnum;
      if (gcTypeEnum && gcTypeEnum.socket) {
        sockets.push(child);
        return null;
      }
      return child;
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
  };

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

  emitLink(link) {
    if (this.props.onLink) { this.props.onLink(link); }
    if (this.parentElement) { this.parentElement.emitLink(link); }
  }

  emitUnlink(link) {
    if (this.props.onUnlink) { this.props.onUnlink(link); }
    if (this.parentElement) { this.parentElement.emitUnlink(link); }
  }

}
