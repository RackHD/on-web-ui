'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import Color from 'color';

import DragEventHelpers from '../../mixins/DragEventHelpers';

import {} from 'material-ui';

import ConfirmDialog from 'common-web-ui/views/dialogs/Confirm';

import generateId from '../../lib/generateId';

import Rectangle from '../../lib/Rectangle';
import Vector from '../../lib/Vector';

@radium
@mixin.decorate(DragEventHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    css: PropTypes.object,
    initialBounds: PropTypes.any,
    initialColor: PropTypes.string,
    initialId: PropTypes.string,
    initialName: PropTypes.string,
    onRemovePanel: PropTypes.func,
    onUpdateBounds: PropTypes.func,
    style: PropTypes.object
  },
  defaultProps: {
    className: 'GCPanelElement',
    css: {},
    initialBounds: [0, 0, 750, 500],
    initialColor: 'grey',
    initialId: null,
    initialName: '(Unamed)',
    onRemovePanel: null,
    onUpdateBounds: null,
    style: {}
  },
  contextTypes: {
    graphCanvas: PropTypes.any,
    // graphCanvasOwner: PropTypes.any,
    parentGCNode: PropTypes.any,
    parentGCGroup: PropTypes.any
  }
})
export default class GCPanelElement extends Component {

  static GCTypeEnum = {element: true, panel: true};

  get graphCanvas() { return this.context.graphCanvas; }

  get graphCanvasViewport() { return this.graphCanvas.refs.viewport; }

  id = this.props.initialId || generateId('panel');

  componentWillMount() {
    this.graphCanvas.register(this);
  }

  componentWillUnmount() {
    this.graphCanvas.unregister(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let state = this.state,
        props = this.props;
    return (
      props.children !== nextProps.children ||
      state.name !== nextState.name ||
      state.color !== nextState.color ||
      state.bounds !== nextState.bounds ||
      state.hover !== nextState.hover ||
      state.moving !== nextState.moving ||
      state.resizing !== nextState.resizing ||
      state.removed !== nextState.removed ||
      state.selected !== nextState.selected
    );
  }

  state = {
    name: this.props.initialName,
    color: this.props.initialColor,
    bounds: new Rectangle(this.props.initialBounds),
    hover: false,
    moving: false,
    resizing: false,
    removed: false,
    selected: false
  };

  render() {
    // console.log('RENDER PANEL');

    if (this.state.removed) { return null; }

    let props = this.props;
    let css = this.preparedCSS;

    let id = this.id;

    return (
      <div
          data-id={id}
          onMouseOver={this.setHoverState.bind(this, true, 1000)}
          onMouseOut={this.setHoverState.bind(this, false, 250)}
          className={props.className}
          style={css.root}>
        <div
            onClick={this.stopEventPropagation}
            onMouseDown={this.movePanel.bind(this)}
            style={css.header}>
          <input
              key="nameInput"
              type="text"
              value={this.state.name}
              style={css.inputs.concat([{width: (this.state.name.length + 1) + 'ex'}])}
              onChange={this.handleNameChange.bind(this)}
              onMouseDown={this.stopEventPropagation}
              onTouchTap={this.stopEventPropagation} />
          <a
              style={css.remove}
              onMouseDown={this.stopEventPropagation}
              onTouchTap={this.removePanel.bind(this)}
              className="fa fa-remove"
              title="Remove" />
          <input
              key="colorInput"
              type="text"
              value={this.state.color}
              style={css.inputs.concat([{float: 'right', width: (this.state.color.length + 1) + 'ex'}])}
              onChange={this.handleColorChange.bind(this)}
              onMouseDown={this.stopEventPropagation}
              onTouchTap={this.stopEventPropagation} />

        </div>
        <div
            onClick={this.toggleSelected.bind(this)}
            style={css.content}>
          {props.children}
        </div>
        <a
            style={css.resize}
            onMouseOver={this.setHoverState.bind(this, true, 100)}
            onMouseOut={this.setHoverState.bind(this, false, 1000)}
            onMouseDown={this.resizePanel.bind(this)}
            className="fa fa-arrows-alt"
            title="Resize" />
      </div>
    );
  }

  css = {
    content: {
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderStyle: 'dotted',
      borderWidth: '0 2px 2px'
    },
    header: {
      cursor: 'move',
      overflow: 'hidden',
      boxSizing: 'border-box',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      padding: 10,
      height: 39
    },
    inputs: {
      color: 'inherit',
      background: 'transparent',
      border: 'none',
      padding: 5,
      marginTop: -5,
      marginRight: '1ex',
      transition: 'all 0.4s ease-out',
      ':focus': {
        color: 'black',
        background: 'white',
        outline: 'inset 2px rgba(127, 127, 127, 0.5)'
      }
    },
    remove: {
      float: 'right',
      color: 'inherit'
    },
    resize: {
      clear: 'both',
      float: 'right',
      color: 'inherit',
      padding: '20px 10px 10px 20px',
      marginTop: -22,
      marginRight: -24,
      cursor: 'nwse-resize',
      visibility: 'hidden',
      // opacity: 0,
      // transition: 'opacity 0.4s ease-out'
    },
    root: {
      position: 'absolute', top: 0, left: 0,
      boxSizing: 'border-box',
      borderColor: 'rgba(255, 255, 255, 0.6)',
      borderStyle: 'solid',
      borderWidth: '3px',
      borderRadius: 14,
      transition: 'border 0.4s ease-out'
    }
  };

  get preparedCSS() {
    let props = this.props,
        bounds = this.state.bounds,
        color,
        text;

    try {
      color = new Color(this.state.color);
      text = color.clone();
    } catch (err) {
      color = new Color(props.initialColor);
      text = color.clone();
    }

    if (color.dark()) { text.lighten(0.75); }
    else { text.darken(0.75); }

    return {
      content: [
        this.css.content,
        {
          overflow: this.state.selected ? 'visible' : 'hidden',
          height: bounds.height - this.css.header.height - 6,
          borderColor: color.rgbString(),
          backgroundColor: color.clone().alpha(0.25).lighten(0.25).rgbaString()
        },
        props.css.content
      ],
      header: [
        this.css.header,
        {
          borderBottom: '1px solid ' + text.rgbString(),
          backgroundColor: color.rgbString(),
          color: text.rgbString()
        },
        props.css.header
      ],
      inputs: [
        this.css.inputs,
        props.css.inputs
      ],
      remove: [
        this.css.remove,
        props.css.remove
      ],
      resize: [
        this.css.resize,
        this.state.hover ? {/*opacity: 1*/visibility: 'visible'} : null,
        props.css.resize
      ],
      root: [
        this.css.root,
        bounds.getCSSTransform(),
        this.state.selected ? {borderColor: 'red'} : null,
        props.css.root,
        props.style
      ]
    };
  }

  stopEventPropagation(e) { e.stopPropagation(); }

  // renamePanel() {}

  // selectPanel() { this.setState({selected: true}); }

  // unselectPanel() { this.setState({selected: false}); }

  // TODO: this is sometimes calls as an event handler for onClick
  //       and should not select the node if the user pans
  toggleSelected(e) {
    if (e) { e.stopPropagation(); }
    this.setState({selected: !this.state.selected});
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleColorChange(event) {
    this.setState({color: event.target.value});
  }

  setHoverState(bool, sleep, e) {
    if (e) { e.stopPropagation(); }
    clearTimeout(this.hoverTimer);
    // TODO: remove if hover toggles opacity, this causes bugs in chrome
    sleep = 100;
    this.hoverTimer = setTimeout(() => this.setState({hover: bool}), sleep || 0);
  }

  removePanel(e) {
    e.stopPropagation();
    // e.preventDefault();
    var confirmProps = {
      callback: (ok) => {
        if (ok) {
          this.setState({removed: true});
          if (this.props.onRemovePanel) {
            this.props.onRemovePanel();
          }
        }
      },
      children: 'Are you sure you want to delete this node?',
      title: 'Confirm Delete:'
    };
    ConfirmDialog.create(confirmProps);
  }

  movePanel(e) {
    var pushFrame = (event, dragState) => {
      dragState.frames = dragState.frames || [];
      var index = dragState.frames.length,
          frame = {
            position: this.state.bounds.position,
            time: event.timeStamp || Date.now()
          },
          lastFrame = dragState.frames[index - 1] || frame,
          timeLapse = (frame.time - lastFrame.time) || 1;
      frame.velocity = lastFrame.position.sub(frame.position).squish(timeLapse).finite();
      frame.duration = timeLapse;
      dragState.frames.push(frame);
      if (dragState.frames.length >= 12) { dragState.frames.shift(); }
    };
    return this.graphCanvasViewport.setupClickDrag({
      down: (event, dragState) => {
        this.setState({moving: true});
        event.stopPropagation();
        dragState.start = event.timeStamp || Date.now();
        dragState.nextMove = -1;
        dragState.lastMove = {
          x: event.relX,
          y: event.relY
        };
        pushFrame(event, dragState);
        clearTimeout(this.physicsMoveTimer);
        this.stopPhysicsMove = true;
      },
      move: (event, dragState) => {
        clearInterval(this.moveRepeat);
        event.stopPropagation();
        var duration = (event.timeStamp || Date.now()) - dragState.start;
        if (duration < 100) { return; }
        var lastX = dragState.lastMove.x,
            lastY = dragState.lastMove.y;
        dragState.lastMove = {
          x: event.relX,
          y: event.relY
        };
        pushFrame(event, dragState);
        var displace = new Vector(lastX - event.relX, lastY - event.relY).squish(this.graphCanvas.scale).negate();
        this.updateBounds(this.state.bounds.clone().translate(displace));
        // this.setState({bounds: this.state.bounds.clone().translate(displace)});
        // this.graphCanvas.refs.nodes.moveNode(
        //   this.props.model.id,
        //   lastX - event.relX,
        //   lastY - event.relY);
        this.moveRepeat = setInterval(() => {
          pushFrame(event, dragState);
        }, 32);
      },
      up: (event, dragState) => {
        clearInterval(this.moveRepeat);
        this.setState({moving: false});
        event.stopPropagation();
        var duration = (event.timeStamp || Date.now()) - dragState.start;
        // if (duration < 100) { return null; }
        if (duration < 100) { return this.toggleSelected(); }
        pushFrame(event, dragState);
        var velocitySum = dragState.frames.reduce(function (lastValue, currFrame) {
          return (lastValue.velocity || lastValue).add(currFrame.velocity);
        });
        velocitySum = velocitySum.squish(dragState.frames.length / 2);
        this.stopPhysicsMove = false;
        var tick = () => {
          if (Math.abs(velocitySum.x) < 0.001 &&
              Math.abs(velocitySum.y) < 0.001) { return; }
          // this.graphCanvas.refs.nodes.moveNode(
          //   this.props.model.id,
          //   velocitySum.x,
          //   velocitySum.y);
          // this.setState({
          //   bounds: this.state.bounds.clone().translate(velocitySum.squish(this.graphCanvas.scale).negate())
          // });
          this.updateBounds(this.state.bounds.clone().translate(velocitySum.squish(this.graphCanvas.scale).negate()));
          velocitySum = velocitySum.scale(0.95);
          if (!this.stopPhysicsMove) {
            this.physicsMoveTimer = setTimeout(tick, 16);
          }
        };
        tick();
      }
    })(e);
  }

  resizePanel(e) {
    return this.graphCanvasViewport.setupClickDrag({
      down: (event, dragState) => {
        this.setState({resizing: true});
        event.stopPropagation();
        dragState.start = event.timeStamp || Date.now();
        dragState.nextMove = -1;
        dragState.lastMove = {
          x: event.relX,
          y: event.relY
        };
        clearTimeout(this.physicsMoveTimer);
        this.stopPhysicsMove = true;
      },
      move: (event, dragState) => {
        clearInterval(this.moveRepeat);
        event.stopPropagation();
        var lastX = dragState.lastMove.x,
            lastY = dragState.lastMove.y;
        dragState.lastMove = {
          x: event.relX,
          y: event.relY
        };
        var displace = new Vector(lastX - event.relX, lastY - event.relY).squish(this.graphCanvas.scale).negate(),
            bounds = this.state.bounds.clone();
        bounds.max = bounds.max.add(displace);
        this.updateBounds(bounds);
      },
      up: (event) => {
        this.setState({resizing: false});
        event.stopPropagation();
      }
    })(e);
  }

  updateBounds(bounds) {
    this.setState({ bounds });
    if (this.props.onUpdateBounds) {
      // HACK: without the timeout resizing a group is very slow.
      // clearTimeout(this.onUpdateBoundsTimer);
      // this.onUpdateBoundsTimer = setTimeout(() =>
      this.props.onUpdateBounds(bounds);//, 16);
    }
  }

}
