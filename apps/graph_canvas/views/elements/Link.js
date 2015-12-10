// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import generateId from '../../lib/generateId';

import Vector from '../../lib/Vector';
import Rectangle from '../../lib/Rectangle';

import ConfirmDialog from 'common-web-ui/views/dialogs/Confirm';

export default class GCLinkElement extends Component {

  static propTypes = {
    from: PropTypes.string,
    to: PropTypes.any,
    isPartial: PropTypes.bool,
    initialColor: PropTypes.string,
    initialId: PropTypes.string,
    onRemove: PropTypes.func
  };

  static defaultProps = {
    from: null,
    to: null,
    isPartial: false,
    initialColor: 'black',
    initialId: null,
    onRemove: null
  };

  static contextTypes = {
    graphCanvas: PropTypes.any,
    parentGCGroup: PropTypes.any
  }

  static GCTypeEnum = {vector: true, link: true};

  static id() { return generateId('link'); }

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  get graphCanvasWorld() {
    return this.graphCanvas.refs.world;
  }

  get linksManager() {
    return this.graphCanvas.refs.links;
  }

  get parentComponent() {
    return this.parentGroup || this.graphCanvasWorld;
  }

  get parentGroup() {
    return this.context.parentGCGroup;
  }

  id = this.props.initialId || this.constructor.id();

  componentWillMount() {
    this.graphCanvas.register(this);
  }

  componentWillUnmount() {
    this.graphCanvas.unregister(this);
  }

  componentDidMount() {
    if (!this.state.isPartial) {
      this.linksManager.register(this);
    }
    this.updateBounds();
  }

  componentDidUpdate() {
    if (!this.state.isPartial && !this.state.removed) {
      this.linksManager.register(this);
    }
    if (this.newLink && (this.fromSocket && this.toSocket) && !this.graphCanvas.refs.links.isDrawing) {
      // debugger;
      this.fromSocket.emitLink(this);
      this.toSocket.emitLink(this);
      delete this.newLink;
      // delete this.fromSocket;
      // delete this.toSocket;
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  state = {
    from: this.props.from,
    to: this.props.to,
    isPartial: this.props.isPartial,
    bounds: null,
    hover: false,
    removed: false
  }

  render() {
    try {
      if (!this.state.removed && this.state.bounds) {
        // console.log('RENDER LINK');
        return this.renderVector(this.state.bounds);
      }
    } catch (err) { console.error(err.stack || err); }
    return null;
  }

  renderVector(bounds) {
    try {
      var //props = this.props,
          gutter = 5,
          stroke = 3,
          style = bounds.css;
      style.top -= gutter;
      style.left -= gutter;
      style.width += gutter + gutter;
      style.height += gutter + gutter;

      var dir = bounds.dir,
          minX = 0 + gutter,
          minY = 0 + gutter,
          maxX = style.width - gutter,
          maxY = style.height - gutter,
          halfX = style.width / 2,
          halfY = style.height / 2,
          hover = this.state.hover ? 'hover ' : '',
          path = '';

      if (!isFinite(halfX)) { halfX = 0; }
      if (!isFinite(halfY)) { halfY = 0; }

      if (dir.x === 1 && dir.y === 1) {
        path = ['M', maxX, maxY, 'Q', halfX, maxY, halfX, halfY, 'T', minX, minY].join(' ');
      }
      else if (dir.x === -1 && dir.y === -1) {
        path = ['M', minX, minY, 'Q', halfX, minY, halfX, halfY, 'T', maxX, maxY].join(' ');
      } else if (dir.x === 1 && dir.y === -1) {
        path = ['M', minX, maxY, 'Q', halfX, maxY, halfX, halfY, 'T', maxX, minY].join(' ');
      }
      else if (dir.x === -1 && dir.y === 1) {
        path = ['M', maxX, minY, 'Q', halfX, minY, halfX, halfY, 'T', minX, maxY].join(' ');
      }

      // NOTE: example is rendering links in the element space and not the vector space so positioning is off.

      // TODO
      // var transform = 'translate(' + style.left + 'px, ' + style.top + 'px)';
      // var socket = this.props.model.socketOut || this.props.model.socketIn;
      // var color = socket && socket.port && socket.port.color || 'black';
      var color = this.props.initialColor;
      if (this.state.hover) { color = 'red'; }

      // style={{overflow: 'visible'}}
      // <g transform={transform}>
      // TODO
      // style={{
      //   position: 'absolute', top: 0, left: 0,
      //   transform: transform
      // }}
      return (
        <svg
            className={'GraphCanvasLink ' + hover}
            data-id={null}
            width={style.width}
            height={style.height}
            x={style.left}
            y={style.top}
            onDoubleClick={this.removeLink.bind(this)}
            viewBox={[
              minX - gutter, minY - gutter,
              maxX + gutter, maxY + gutter
            ].join(' ')}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg">
          <path
              d={path}
              fill="transparent"
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="round"
              style={{
                // pointerEvents: 'all',
                // ':hover': {
                //   stroke: 'red'
                // }
              }}
              onMouseOver={this.onHoverCurve.bind(this)}
              onMouseMove={this.onHoverCurve.bind(this)}
              onMouseOut={this.onLeaveCurve.bind(this)} />
        </svg>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

  updateBounds(_retry, _err) {
    if (_retry > 3) { throw _err; }
    _retry = _retry || 0;

    try {
      var fromSocket = this.graphCanvas.lookup(this.state.from),
          fromSocketElement = findDOMNode(fromSocket).querySelector('.GraphCanvasSocketIcon'),
          fromVector = this.linksManager.getSocketCenter(fromSocketElement);

      var toSocket, toSocketElement, toVector;

      if (this.state.isPartial) {
        this.newLink = true;
        toVector = new Vector(this.state.to);
      }
      else {
        toSocket = this.graphCanvas.lookup(this.state.to);
        toSocketElement = findDOMNode(toSocket).querySelector('.GraphCanvasSocketIcon');
        toVector = this.linksManager.getSocketCenter(toSocketElement);
        // if (this.newLink) {
        this.fromSocket = fromSocket;
        this.toSocket = toSocket;
        // }
      }

      let bounds = new Rectangle(fromVector.x, fromVector.y, toVector.x, toVector.y);
      this.setState({ bounds });
    }

    catch (err) {
      if (err.gcIsSafe) {
        console.warn(err.message);
        setTimeout(() => this.updateBounds(_retry + 1, err), 500);
      }
      else {
        console.error(err);
      }
    }
  }

  onHoverCurve(skipSocket) {
    if (this.state.isPartial) { return; }
    this.setState({hover: true});
    this.updateBounds();
    if (skipSocket === true) { return; }
    let fromSocket = this.graphCanvas.lookup(this.state.from),
        toSocket = this.graphCanvas.lookup(this.state.to);
    if (skipSocket !== fromSocket) { fromSocket.onHover(skipSocket ? true : this); }
    if (skipSocket !== toSocket) { toSocket.onHover(toSocket ? true : this); }
  }

  onLeaveCurve(skipSocket) {
    if (this.state.isPartial) { return; }
    this.setState({hover: false});
    if (skipSocket === true) { return; }
    let fromSocket = this.graphCanvas.lookup(this.state.from),
        toSocket = this.graphCanvas.lookup(this.state.to);
    if (skipSocket !== fromSocket) { fromSocket.onLeave(skipSocket ? true : this); }
    if (skipSocket !== toSocket) { toSocket.onLeave(toSocket ? true : this); }
  }

  removeLink(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
    e.preventDefault();
    var confirmProps = {
      callback: (ok) => {
        if (ok) {
          this.destroyLink();
        }
      },
      children: 'Are you sure you want to delete this link?',
      title: 'Confirm Delete:'
    };
    ConfirmDialog.create(confirmProps);
  }

  destroyLink() {
    this.graphCanvas.unregister(this);
    this.linksManager.unregister(this);
    let fromSocket = this.graphCanvas.lookup(this.state.from),
        toSocket = this.graphCanvas.lookup(this.state.to);
    debugger;
    fromSocket.emitUnlink(this);
    toSocket.emitUnlink(this);
    this.setState({removed: true});
    // TODO: actually remove from this.parentComponent
    if (this.props.onRemove) { this.props.onRemove(this); }
  }

}
