'use strict';


import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import Color from 'color';

import DragEventHelpers from '../../mixins/DragEventHelpers';

import {} from 'material-ui';

// import Rectangle from '../../lib/Rectangle';
// import Vector from '../../lib/Vector';

import generateId from '../../lib/generateId';

@radium
@mixin.decorate(DragEventHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    css: PropTypes.object,
    id: PropTypes.string,
    initialColor: PropTypes.string,
    initialId: PropTypes.string,
    initialName: PropTypes.string,
    style: PropTypes.any
  },
  defaultProps: {
    className: 'GCSocketElement',
    css: {},
    initialColor: 'black',
    initialId: null,
    initialName: 'port',
    style: null
  },
  contextTypes: {
    graphCanvas: PropTypes.any,
    parentGCPort: PropTypes.any
  }
})
export default class GCSocketElement extends Component {

  static GCTypeEnum = {element: true, socket: true};

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

  id = this.props.initialId || generateId('socket');

  componentWillMount() {
    this.graphCanvas.register(this);
  }

  componentWillUnmount() {
    this.graphCanvas.unregister(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let state = this.state;
    return (
      state.color !== nextState.color ||
      state.name !== nextState.name
    );
  }

  state = {
    color: new Color(this.props.initialColor),
    name: this.props.initialName
  };

  render() {
    console.log('RENDER SOCKET');
    var css = this.preparedCSS;

    var typeCell = (
      <div key="type" className="cell" style={css.type}>{this.state.name}</div>
    );

    var socketClassName = 'GraphCanvasSocketIcon socket fa ';

    var links = this.graphCanvas.lookupLinks(this.id);
    socketClassName += (links.length) ?
      'fa-dot-circle-o' : 'fa-circle-o';

    var socketCell = (
      <div key="socket" className="cell">
        <span style={css.socket}
              className={socketClassName}
              onMouseDown={this.drawLink.bind(this)} />
      </div>
    );

    var dir = this.props.dir,
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
           data-id={this.id}>
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
    return {
      socket: [
        this.css.socket,
        {color: color.hexString()},
        props.css.socket
      ],
      type: [
        this.css.type,
        {color: color.hexString()},
        props.css.type
      ],
      root: [this.css.root, props.css.root, props.style]
    };
  }

  drawLink(_event) {
    this.graphCanvasViewport.setupClickDrag({
      down: (event, dragState, e) => this.linksManager.drawLinkStart(event, dragState, e),
      move: (event, dragState, e) => this.linksManager.drawLinkContinue(event, dragState, e),
      up: (event, dragState, e) => this.linksManager.drawLinkFinish(event, dragState, e)
    }, {
      fromSocket: this
    })(_event);
  }

}
