'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import Color from 'color';

import DragEventHelpers from '../../mixins/DragEventHelpers';

import {} from 'material-ui';

// import ConfirmDialog from 'common-web-ui/views/dialogs/Confirm';

import Rectangle from '../../lib/Rectangle';
// import Vector from '../../lib/Vector';

import generateId from '../../lib/generateId';

// import {
//   } from 'material-ui';
import GCNodeSocketElement from './NodeSocket';

@radium
@mixin.decorate(DragEventHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    css: PropTypes.object,
    id: PropTypes.string,
    initialBounds: PropTypes.any,
    initialColor: PropTypes.string,
    initialName: PropTypes.string,
    initialSockets: PropTypes.array,
    style: PropTypes.any
  },
  defaultProps: {
    className: 'GCNodePortElement',
    css: {},
    id: null,
    initialBounds: [0, 0, 200, 200],
    initialColor: 'black',
    initialName: 'port',
    initialSockets: [],
    style: null
  },
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GCNodePortElement extends Component {

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  constructor(props) {
    super(props);
    this.props.id = this.props.id || generateId('port');
    this.state.sockets = this.state.sockets.concat(this.filterSocketsFromChildren());
  }

  state = {
    bounds: new Rectangle(this.props.initialBounds),
    color: new Color(this.props.initialColor),
    name: this.props.initialName,
    sockets: this.mapRawSockets(this.props.initialSockets)
  };

  render() {
    let css = this.preparedCSS,
        className = 'ungrid ' + this.props.className,
        leftSockets = [],
        rightSockets = [];
    this.state.sockets.forEach(socket => {
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
           data-id={this.props.id}
           style={css.root}>
        <div className="line">
          <div className="cell">{leftSockets}</div>
          <div className="cell">
            <span className="name" style={css.name}>{this.state.name}</span>
          </div>
          <div className="cell">{rightSockets}</div>
        </div>
        {this.props.children}
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
      return <GCNodeSocketElement {...rawSocket} />;
    });
  }

  filterSocketsFromChildren() {
    var newSockets = [];
    this.props.children = React.Children.map(this.props.children, child => {
      if (child.type.isSocket) {
        newSockets.push(child);
        return null;
      }
      return child;
    });
    return newSockets;
  }

}
