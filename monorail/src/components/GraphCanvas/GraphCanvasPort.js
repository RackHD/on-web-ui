'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorateComponent from '../../../../common/lib/decorateComponent';
import DragEventHelpers from './mixins/DragEventHelpers';
/* eslint-enable no-unused-vars */

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
      <div className="GraphCanvasPort">
        Hello World
      </div>
    );
  }

}
