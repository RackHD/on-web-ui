'use strict';

import { Component } from 'mach-react';

import CoordinateHelpers from '../mixins/CoordinateHelpers';

import Vector from '../lib/Vector';

import GSViewport from './Viewport';
import GSWorld from './World';

import websocket from '../messengers/websocket'

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

  emitThisView(width=this.props.viewWidth, height=this.props.viewHeight) {
    this.lastSetView = Date.now();
    websocket.set('viewers', this.state.position.toArray(), [
      this.props.viewWidth / this.state.scale,
      this.props.viewHeight / this.state.scale
    ]);
  }

  updateThisView(w, h) {
    if (!this.state.id) { return; }
    clearTimeout(this.setViewTimeout);
    if (this.lastSetView + 5000 < Date.now()) this.emitThisView(w, h);
    else this.setViewTimeout = setTimeout(this.emitThisView.bind(this, w, h), 500);
  }

  componentDidMount() {
    websocket.init((msg) => {
      this.setState({id: msg.id});
      this.emitThisView();
      setTimeout(websocket.list.bind(websocket, 'viewers'), 100);
      setTimeout(websocket.list.bind(websocket, 'entities'), 100);
    }, () => {
      websocket.events.on('list', (msg) => {
        this.refs.viewport.refs.world.updateList(msg.collection, msg.items);
      });

      websocket.events.on('set', (msg) => {
        this.refs.viewport.refs.world.upsertItem(msg);
      });

      websocket.events.on('remove', (msg) => {
        this.refs.viewport.refs.world.removeItem(msg);
      });

      websocket.events.on('pan', (msg) => {
        this.offsetPosition(new Vector([msg.offset[0], msg.offset[1]]), true);
      });

      websocket.events.on('move', (msg) => {
        if (msg.collection === 'viewers' && msg.id === this.state.id) {
          this.offsetPosition(new Vector(msg.offset).negate(), true);
        }
        this.refs.viewport.refs.world.setState(state => {
          if (!state[msg.collection] || !state[msg.collection][msg.id]) return null;
          let position = state[[msg.collection]][msg.id].position;
          state[msg.collection][msg.id].position = [
            position[0] + msg.offset[0],
            position[1] + msg.offset[1]
          ];
          return state;
        });
      });
    });
  }

  componentWillUnmount() {}

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props,
        state = this.state;
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

  offsetElementPosition(entity, offset, noBroadcast) {
    if (!noBroadcast) this.broadcastMove('entities', entity.props.id, offset);
    entity.offsetPosition(offset);
  }

  offsetViewPosition(view, offset, noBroadcast) {
    if (!noBroadcast) this.broadcastMove('viewers', view.props.id, offset);
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

  broadcastPan(offset) {
    websocket.pan(offset);
  }

  broadcastMove(collection, id, offset) {
    websocket.move(collection, id, offset);
  }

}
