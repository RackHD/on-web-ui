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

  emitThisView() {
    this.lastSetView = Date.now();
    viewers.set(this.state.position.toArray(), [
      this.props.viewWidth / this.state.scale,
      this.props.viewHeight / this.state.scale
    ]);
  }

  updateThisView() {
    if (!this.state.id) { return; }
    clearTimeout(this.setViewTimeout);
    if (this.lastSetView + 5000 < Date.now()) this.setView();
    else this.setViewTimeout = setTimeout(this.emitThisView.bind(this), 500);
  }

  componentDidMount() {
    viewers.init((msg) => {
      this.setState({id: msg.id});
      this.emitThisView();
      setTimeout(viewers.list.bind(viewers), 10);
    }, () => {
      viewers.events.on('list', (msg) => {
        this.refs.viewport.refs.world.updateViewers(msg.viewers);
      });

      viewers.events.on('set', (msg) => {
        this.refs.viewport.refs.world.upsertViewer(msg);
      });

      viewers.events.on('remove', (msg) => {
        this.refs.viewport.refs.world.removeViewer(msg);
      });

      viewers.events.on('pan', (msg) => {
        this.offsetPosition(new Vector([
          msg.offset[0],
          msg.offset[1]
        ]), true);
      });

      viewers.events.on('move', (msg) => {
        if (msg.id === this.state.id) {
          this.offsetPosition(new Vector(msg.offset).negate(), true);
        }
        this.refs.viewport.refs.world.setState(state => {
          if (!state.viewers[msg.id]) return null;
          state.viewers[msg.id].position =
            new Vector(state.viewers[msg.id].position).sub(msg.offset);
          return state;
        });
      });
    });
  }

  componentWillUnmount() {}

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props,
        state = this.state;
    // debugger;
    return (
      props.viewHeight !== nextProps.viewHeight ||
      props.viewWidth !== nextProps.viewWidth ||
      props.worldHeight !== nextProps.worldHeight ||
      props.worldWidth !== nextProps.worldWidth ||
      state.position !== nextState.position ||
      state.scale !== nextState.scale ||
      state.id !== nextState.id
    );
  }

  componentDidUpdate() {
    this.updateThisView();
  }

  /**
  @method
    @name render
    @desc
  */
  render(React) {
    // console.log('render canvas', this.state);
    // debugger;
    try {
      let props = this.props,
          css = [this.css.root, this.cssViewSize, props.css.root, props.style];

      return (
        <div className={props.className} style={css}>
          {this.state.id}
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

  offsetViewPosition(view, offset, noBroadcast) {
    if (!noBroadcast) this.broadcastMove(view.props.id, offset);
    view.offsetPosition(offset);
  }

  offsetPosition(offset, noBroadcast) {
    this.setState(state => {
      return {
        position: new Vector([
          state.position[0] - offset[0],
          state.position[1] - offset[1]
        ])
      };
    });
    this.refs.viewport.refs.world.queueUpdate();
    if (!noBroadcast) this.broadcastPan(offset);
  }

  updateScale(scale) {
    this.setState({ scale });
    this.refs.viewport.refs.world.queueUpdate();
  }

  broadcastPan(offset) { viewers.pan(offset); }

  broadcastMove(id, offset) {
    viewers.move(id, offset);
  }

}
