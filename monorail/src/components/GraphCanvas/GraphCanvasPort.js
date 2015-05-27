'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
import DragEventHelpers from './mixins/DragEventHelpers';
/* eslint-enable no-unused-vars */

import {
    IconButton
  } from 'material-ui';

@decorateComponent({
  propTypes: {
  },
  defaultProps: {
  }
})
@mixin.decorate(DragEventHelpers)
export default class GraphCanvasPort extends Component {

  state = {};

  render() {
    return (
      <div className="GraphCanvasPort"
           onMouseDown={this.drawLink()}>
        <IconButton className="socket in left"
                    iconClassName="fa fa-circle-o" />
        <span className="name">PORT</span>
        <IconButton className="socket out right"
                    iconClassName="fa fa-circle-o" />
      </div>
    );
  }

  drawLink() {
    return this.props.canvas.setupClickDrag({
      down: (event, dragState, e) => this.props.canvas.drawLinkStart(event, dragState, e),
      move: (event, dragState, e) => this.props.canvas.drawLinkContinue(event, dragState, e),
      up: (event, dragState, e) => this.props.canvas.drawLinkFinish(event, dragState, e)
    });
  }

}
