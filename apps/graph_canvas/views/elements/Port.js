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

import GCSocketElement from './Socket';

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
    initialSockets: [],
    style: null
  },
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GCPortElement extends Component {

  static GCTypeEnum = {element: true, port: true};

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  id = this.props.initialId || generateId('port');

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
      state.name !== nextState.name ||
      state.sockets !== nextState.sockets
    );
  }

  state = {
    bounds: new Rectangle(this.props.initialBounds),
    color: new Color(this.props.initialColor),
    name: this.props.initialName,
    sockets: this.mapRawSockets(this.props.initialSockets)
  };

  render() {
    console.log('RENDER PORT');
    let css = this.preparedCSS,
        className = 'ungrid ' + this.props.className,
        leftSockets = [],
        rightSockets = [];
    // console.log(this.props.children, this.state.sockets);
    var newSockets = [];
    var children = React.Children.map(this.props.children, child => {
      if (child.type.GCTypeEnum && child.type.GCTypeEnum.socket) {
        newSockets.push(child);
        return null;
      }
      else {
        return child;
      }
    });
    this.state.sockets.concat(newSockets).forEach(socket => {
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
      fontSize: '0.7em',
      lineHeight: '16px'
    },
    root: {
      clear: 'both',
      minHeight: 16,
      textAlign: 'center',
      borderBottom: '1px dotted #ccc'
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

  mapRawSockets(rawSockets) {
    return rawSockets.map(rawSocket => {
      return <GCSocketElement {...rawSocket} />;
    });
  }

}
