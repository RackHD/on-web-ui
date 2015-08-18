'use strict';

import { Component } from 'mach-react';

import CoordinateHelpers from '../mixins/CoordinateHelpers';

import Vector from '../lib/Vector';

import GSViewport from './Viewport';
import GSWorld from './World';

/**
# GSCanvas

@object
  @type class
  @extends React.Component
  @name GSCanvas
  @desc
*/

export default class GSCanvas extends Component {

  static mixins = [ CoordinateHelpers ]

  static defaultProps = {
    className: 'GSCanvas',
    css: {},
    enableMarks: false,
    initialScale: 1,
    initialX: 0,
    initialY: 0,
    style: {},
    viewHeight: 600,
    viewWidth: 800,
    worldHeight: 2000,
    worldWidth: 2000
  }

  get canvas() { return this; }

  state = {
    position: new Vector(
      this.props.initialX,
      this.props.initialY
    ),
    scale: this.props.initialScale
  };

  css = {
    root: {
      overflow: 'hidden'
    }
  };

  childContext = {canvas: this};

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props,
        state = this.state;
    return (
      props.viewHeight !== nextProps.viewHeight ||
      props.viewWidth !== nextProps.viewWidth ||
      props.worldHeight !== nextProps.worldHeight ||
      props.worldWidth !== nextProps.worldWidth ||
      state.position !== nextState.position ||
      state.scale !== nextState.scale
    );
  }

  /**
  @method
    @name render
    @desc
  */
  render(React) {
    try {
      let props = this.props,
          css = [this.css.root, this.cssViewSize, props.css.root, props.style];

      return (
        <div className={props.className} style={css}>
          <GSViewport ref="viewport">
            <GSWorld ref="world">
              {props.children}
            </GSWorld>
          </GSViewport>
        </div>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

  get cssViewSize() {
    return {
      width: this.props.viewWidth,
      height: this.props.viewHeight
    };
  }

  get cssWorldSize() {
    return {
      width: this.props.worldWidth,
      height: this.props.worldHeight
    };
  }

  get elements() {
    return [];
  }

  get vectors() {
    return [];
  }

  updatePosition(position) {
    this.setState({ position });
    this.refs.viewport.refs.world.queueUpdate();
  }

  updateScale(scale) {
    this.setState({ scale });
    this.refs.viewport.refs.world.queueUpdate();
  }

}
