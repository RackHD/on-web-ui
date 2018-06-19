// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'src-common/lib/mixin';

import Color from 'color';

import DragEventHelpers from '../../mixins/DragEventHelpers';

import generateId from '../../lib/generateId';

@radium
@mixin(DragEventHelpers)
export default class GCSocketElement extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    id: PropTypes.string,
    dir: PropTypes.array,
    initialColor: PropTypes.string,
    initialId: PropTypes.string,
    initialName: PropTypes.string,
    onLink: PropTypes.func,
    onUnlink: PropTypes.func,
    style: PropTypes.any
  };

  static defaultProps = {
    className: 'GCSocketElement',
    css: {},
    dir: [1, 0],
    initialColor: 'black',
    initialId: null,
    initialName: 'port',
    onLink: null,
    onUnlink: null,
    style: null
  };

  static contextTypes = {
    graphCanvas: PropTypes.any,
    parentGCPort: PropTypes.any,
    parentGCNode: PropTypes.any,
    parentGCGroup: PropTypes.any
  };

  static GCTypeEnum = {element: true, socket: true};

  static id() { return generateId('socket'); }

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  get graphCanvasViewport() {
    return this.graphCanvas.refs.viewport;
  }

  get linksManager() {
    return this.graphCanvas.refs.links;
  }

  get parentPort() {
    return this.context.parentGCPort;
  }

  get parentNode() {
    return this.context.parentGCNode;
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

  shouldComponentUpdate(nextProps, nextState) {
    let state = this.state;
    return (
      state.hover !== nextState.hover ||
      state.color !== nextState.color ||
      state.name !== nextState.name
    );
  }

  state = {
    hover: false,
    color: new Color(this.props.initialColor),
    name: this.props.initialName
  };

  render() {
    // console.log('RENDER SOCKET');

    let css = this.preparedCSS;

    let typeCell = (
      <div key="type" className="cell" style={css.type}>{this.state.name}</div>
    );

    let socketClassName = 'GraphCanvasSocketIcon socket fa ';

    let links = this.graphCanvas.lookupLinks(this.id);
    socketClassName += (links.length && (links[0] || links[1])) ?
      'fa-dot-circle-o' : 'fa-circle-o';

    let socketCell = (
      <div key="socket" className="cell">
        <span style={css.socket}
              className={socketClassName}
              onMouseDown={this.drawLink.bind(this)} />
      </div>
    );

    if (this.props.hideLabel) {
      return (
        <div className="GraphCanvasSocket"
             style={[{display: 'inline-block'}, this.props.style]}
             data-id={this.id}
             onMouseOver={this.onHover.bind(this)}
             onMouseOut={this.onLeave.bind(this)}>
          {socketCell}
        </div>
      );
    }

    let dir = this.props.dir,
        cells;

    if (dir[0] === -1) {
      cells = [socketCell, typeCell];
    }
    else if (dir[0] === 1) {
      cells = [typeCell, socketCell];
    }
    else {
      console.error(new Error('Invalid socket dir').stack);
    }

    return (
      <div className="GraphCanvasSocket ungrid"
           data-id={this.id}
           onMouseOver={this.onHover.bind(this)}
           onMouseOut={this.onLeave.bind(this)}>
        <div className="line">
          {cells}
        </div>
      </div>
    );
  }

  css = {
    socket: {},
    type: {
      fontSize: '8px',
      lineHeight: '10px'
    },
    root: {
      boxSizing: 'border-box'
    }
  };

  get preparedCSS() {
    let props = this.props,
        color = this.state.color;
    let cssColor = {color: this.state.hover ? 'red' : color.hexString()};
    return {
      socket: [
        this.css.socket,
        cssColor,
        props.css.socket
      ],
      type: [
        this.css.type,
        cssColor,
        props.css.type
      ],
      root: [this.css.root, props.css.root, props.style]
    };
  }

  onHover(skipLink) {
    this.setState({hover: true});
    let links = this.graphCanvas.lookupLinks(this.id);
    if (skipLink === true) { return; }
    links.forEach(link => {
      if (link === skipLink) { return; }
      link.onHoverCurve(skipLink ? true : this);
    });
  }

  onLeave(skipLink) {
    this.setState({hover: false});
    let links = this.graphCanvas.lookupLinks(this.id);
    if (skipLink === true) { return; }
    links.forEach(link => {
      if (link === skipLink) { return; }
      link.onLeaveCurve(skipLink ? true : this);
    });
  }

  drawLink(_event) {
    if (!this.linksManager) {
      throw new Error('Missing links manager');
    }
    this.graphCanvasViewport.setupClickDrag({
      down: (event, dragState, e) =>
        this.linksManager && this.linksManager.drawLinkStart(event, dragState, e),
      move: (event, dragState, e) =>
        this.linksManager && this.linksManager.drawLinkContinue(event, dragState, e),
      up: (event, dragState, e) =>
        this.linksManager && this.linksManager.drawLinkFinish(event, dragState, e)
    }, {
      fromSocket: this
    })(_event);
  }

  emitLink(link) {
    if (this.props.onLink) { this.props.onLink(link); }
    if (this.parentPort) { this.parentPort.emitLink(link); }
    else if (this.parentNode) { this.parentNode.emitLink(link); }
    else if (this.parentGroup) { this.parentGroup.emitLink(link); }
    else if (this.graphCanvas) { this.graphCanvas.emitLink(link); }
  }

  emitUnlink(link) {
    if (this.props.onUnlink) { this.props.onUnlink(link); }
    if (this.parentPort) { this.parentPort.emitUnlink(link); }
    else if (this.parentNode) { this.parentNode.emitUnlink(link); }
    else if (this.parentGroup) { this.parentGroup.emitUnlink(link); }
    else if (this.graphCanvas) { this.graphCanvas.emitUnlink(link); }
  }

}
