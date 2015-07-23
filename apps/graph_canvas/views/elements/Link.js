'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';
import decorate from 'common-web-ui/lib/decorate';

import generateId from '../../lib/generateId';

import Vector from '../../lib/Vector';
import Rectangle from '../../lib/Rectangle';

import ConfirmDialog from 'common-web-ui/views/dialogs/Confirm';

@decorate({
  propTypes: {
    from: PropTypes.string,
    to: PropTypes.any,
    isPartial: PropTypes.bool,
    initialColor: PropTypes.string,
    initialId: PropTypes.string
  },
  defaultProps: {
    from: null,
    to: null,
    isPartial: false,
    initialColor: 'black',
    initialId: null
  },
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GCLinkElement extends Component {

  static GCTypeEnum = {vector: true, link: true};

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  get linksManager() {
    return this.graphCanvas.refs.links;
  }

  id = this.props.initialId || generateId('link');

  componentWillMount() {
    console.log('LINK WILL MOUNT');
    this.graphCanvas.register(this);
  }

  componentWillUnmount() {
    this.graphCanvas.unregister(this);
  }

  componentDidMount() {
    console.log('LINK DID MOUNT');
    if (!this.props.isPartial) {
      this.linksManager.register(this);
    }
    this.updateBounds();
  }

  componentDidUpdate() {
    if (!this.props.isPartial) {
      this.linksManager.register(this);
    }
  }

  // componentWillReceiveProps(nextProps) {
    // let update = false;
    // if (nextProps.from || nextProps.to) {
    //   this.props.from = nextProps.from || this.props.from;
    //   this.props.to = nextProps.to || this.props.to;
    //   update = true;
    // }
    // if (!nextProps.isPartial && this.props.isPartial) {
    //   this.linksManager.register(this);
    //   update = true;
    // }
    // this.props.isPartial = nextProps.isPartial || this.props.isPartial;
    // if (update) { this.updateBounds(); }
    // this.setState({
    //   from: nextProps.from,
    //   to: nextProps.to,
    //   isPartial: nextProps.isPartial
    // });
  // }

  shouldComponentUpdate() {
    return true;
  }

  state = {
    from: this.props.from,
    to: this.props.to,
    isPartial: this.props.isPartial,
    bounds: null,
    hover: false
  }

  render() {
    try {
      if (this.state.bounds) {
        console.log('RENDER LINK');
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
                pointerEvents: 'all',
                ':hover': {
                  stroke: 'red'
                }
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
          fromSocketElement = React.findDOMNode(fromSocket).querySelector('.GraphCanvasSocketIcon'),
          fromVector = this.linksManager.getSocketCenter(fromSocketElement);

      var toSocket, toSocketElement, toVector;

      console.log('UPDATE BOUNDS', this.state.to);

      if (this.state.isPartial) {
        toVector = new Vector(this.state.to);
      }
      else {
        toSocket = this.graphCanvas.lookup(this.state.to);
        toSocketElement = React.findDOMNode(toSocket).querySelector('.GraphCanvasSocketIcon');
        toVector = this.linksManager.getSocketCenter(toSocketElement);
      }

      let bounds = new Rectangle(fromVector.x, fromVector.y, toVector.x, toVector.y);
      // console.log(bounds.toString());
      this.setState({ bounds });
    } catch (err) {
      if (err.gcIsSafe) {
        console.warn(err.message);
        setTimeout(() => this.updateBounds(_retry + 1, err), 500);
      }
      else {
        console.error(err);
      }
    }
  }

  onHoverCurve() {
    this.setState({hover: true});
    this.updateBounds();
  }

  onLeaveCurve() {
    this.setState({hover: false});
  }

  removeLink(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
    e.preventDefault();
    var confirmProps = {
      callback: (ok) => {
        if (ok) {
          this.linksManager.unregister(this.props.model);
        }
      },
      children: 'Are you sure you want to delete this link?',
      title: 'Confirm Delete:'
    };
    ConfirmDialog.create(confirmProps);
  }


}
