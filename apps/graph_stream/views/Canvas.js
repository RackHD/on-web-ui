'use strict';

import { Component } from 'mach-react';

import CoordinateHelpers from '../mixins/CoordinateHelpers';

import Vector from '../lib/Vector';

import GSViewport from './Viewport';
import GSWorld from './World';

import viewers from '../messengers/viewers'

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

  componentDidMount() {
    viewers.init((msg) => {
      this.setState({id: msg.id});
      this.refs.viewport.refs.world.updateViewers(msg.viewers);

      viewers.ready(() => {
        viewers.reg(
          this.state.position.toArray(),
          [this.props.viewWidth, this.props.viewHeight]
        )
      });
    });

    viewers.events.on('reg', (msg) => {
      this.refs.viewport.refs.world.addViewer(msg);
    });

    viewers.events.on('unreg', (msg) => {
      this.refs.viewport.refs.world.removeViewer(msg);
    });

    viewers.events.on('pan', (msg) => {
      this.updatePosition(new Vector([
        this.state.position[0] - msg.offset[0],
        this.state.position[1] - msg.offset[1]
      ]), true);
    });

    viewers.events.on('pan', (msg) => {
      if (msg.id === this.state.id) {
        this.updatePosition(new Vector([
          this.state.position[0] - msg.offset[0],
          this.state.position[1] - msg.offset[1]
        ]), true);
      }
    });
  }

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

  updatePosition(position, noBroadcast) {
    position = new Vector(position);
    if (!noBroadcast) {
      let offset = new Vector([
        this.state.position.x - position.x,
        this.state.position.y - position.y
      ]);
      this.broadcastPan(offset);
    }
    this.setState({ position });
    this.refs.viewport.refs.world.queueUpdate();
  }

  updateScale(scale) {
    this.setState({ scale });
    this.refs.viewport.refs.world.queueUpdate();
  }

  broadcastPan(offset) { viewers.pan(offset); }

  broadcastMove(id, offset) { viewers.move(id, offset); }

}
