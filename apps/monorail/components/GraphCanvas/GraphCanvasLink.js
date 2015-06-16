'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
/* eslint-enable no-unused-vars */

@decorateComponent({
  propTypes: {
    active: PropTypes.bool,
    canvas: PropTypes.any,
    model: PropTypes.any
  },
  defaultProps: {
    active: false,
    canvas: null,
    model: null
  }
})
export default class GraphCanvasLink extends Component {

  state = {hover: false};
  removeLink = this.removeLink.bind(this);

  render() {
    try {
      var props = this.props,
          gutter = 5,
          stroke = 3,
          style = props.model.data.bounds.css;
      style.top -= gutter;
      style.left -= gutter;
      style.width += gutter + gutter;
      style.height += gutter + gutter;

      var dir = props.model.data.bounds.dir,
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

      var transform = 'translate(' + style.left + ' ' + style.top + ')';
      return (
        <svg className={'GraphCanvasLink ' + hover}
             width={style.width}
             height={style.height}
             data-id={props.model.id}
             onDoubleClick={this.removeLink}
             viewBox={[
               minX - gutter, minY - gutter,
               maxX + gutter, maxY + gutter
             ].join(' ')}
             preserveAspectRatio="none"
             xmlns="http://www.w3.org/2000/svg">
          <g transform={transform}>
            <path d={path}
                  fill="transparent"
                  stroke="black"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  onMouseOver={this.onHoverCurve.bind(this)}
                  onMouseMove={this.onHoverCurve.bind(this)}
                  onMouseOut={this.onLeaveCurve.bind(this)} />
          </g>
        </svg>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

  onHoverCurve() {
    this.setState({hover: true});
  }

  onLeaveCurve() {
    this.setState({hover: false});
  }

  removeLink(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm('Are you sure?')) { return; } // eslint-disable-line no-alert
    this.props.canvas.removeLink(this.props.model);
  }

}
