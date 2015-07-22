'use strict';

import React, // eslint-disable-line no-unused-vars
  { PropTypes } from 'react';
import decorate from 'common-web-ui/lib/decorate';

import Vector from '../../lib/Vector';
import Rectangle from '../../lib/Rectangle';

import GCLinkElement from './Link';

@decorate({
  propTypes: {
    from: PropTypes.string,
    to: PropTypes.array,
    initialColor: PropTypes.string,
    initialId: PropTypes.string
  },
  defaultProps: {
    from: null,
    to: new Vector(0, 0),
    initialColor: 'black',
    initialId: null
  },
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GCPartialLinkElement extends GCLinkElement {

  static GCTypeEnum = {vector: true, link: true, partial: true};

  componentWillReceiveProps(nextProps) {
    this.props.to = nextProps.to;
    this.updateBounds();
  }

  updateBounds(_retry, _err) {
    if (_retry > 3) { throw _err; }
    _retry = _retry || 0;
    try {
      var fromSocket = this.graphCanvas.lookup(this.props.from),
          fromSocketElement = React.findDOMNode(fromSocket).querySelector('.GraphCanvasSocketIcon'),
          fromVector = this.linksManager.getSocketCenter(fromSocketElement);

      var toVector = new Vector(this.props.to);

      this.setState({
        bounds: new Rectangle(fromVector.x, fromVector.y, toVector.x, toVector.y)
      });
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

}
