// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'src-common/lib/mixin';

import Color from 'color';

import DragEventHelpers from '../../mixins/DragEventHelpers';

// import ConfirmDialog from 'src-common/views/ConfirmDialog';

import generateId from '../../lib/generateId';

import Rectangle from '../../lib/Rectangle';
import Vector from '../../lib/Vector';

@radium
@mixin(DragEventHelpers)
export default class GCPanelElement extends Component {

  static propTypes = {
    className: PropTypes.string,
    // confirmRemove: PropTypes.bool,
    css: PropTypes.object,
    initialBounds: PropTypes.any,
    initialColor: PropTypes.string,
    initialId: PropTypes.string,
    initialName: PropTypes.string,
    isChangable: PropTypes.bool,
    isRemovable: PropTypes.bool,
    isResizable: PropTypes.bool,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    onRemovePanel: PropTypes.func,
    onUpdateBounds: PropTypes.func,
    showColorInput: PropTypes.bool,
    showRemoveButton: PropTypes.bool,
    showResizeButton: PropTypes.bool,
    style: PropTypes.object
  };

  static defaultProps = {
    className: 'GCPanelElement',
    // confirmRemove: false,
    css: {},
    initialBounds: [0, 0, 750, 500],
    initialColor: 'grey',
    initialId: null,
    initialName: '(Unamed)',
    isChangable: true,
    isRemovable: true,
    isResizable: false,
    onChange: null,
    onSelect: null,
    onRemovePanel: null,
    onUpdateBounds: null,
    showColorInput: false,
    showRemoveButton: true,
    showResizeButton: true,
    style: {}
  };

  static contextTypes = {
    graphCanvas: PropTypes.any,
    parentGCNode: PropTypes.any,
    parentGCGroup: PropTypes.any
  };

  static GCTypeEnum = {element: true, panel: true};

  static id() { return generateId('panel'); }

  get graphCanvas() { return this.context.graphCanvas; }

  get graphCanvasViewport() { return this.graphCanvas.refs.viewport; }

  id = this.props.initialId || this.constructor.id();

  componentWillMount() {
    this.graphCanvas.register(this);
  }

  componentWillUnmount() {
    this.graphCanvas.unregister(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let { state, props } = this;

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
    // confirmRemove: false,
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
    if (this.state.removed) { return null; }

    let props = this.props;
    let css = this.preparedCSS;

    let id = this.id;

    return (
      <div ref="root"
          data-id={id}
          onMouseDown={this.movePanel.bind(this)}
          onMouseOver={this.setHoverState.bind(this, true, 1000)}
          onMouseOut={this.setHoverState.bind(this, false, 250)}
          className={props.className}
          style={css.root}>
        <div style={css.wrapper}>
          <div ref="content"
              style={css.content}
              onScroll={this.updateLinks.bind(this)}>
            {this.props.leftSockets}
            <input ref="nameInput"
                key="nameInput"
                type="text"
                value={this.state.name}
                style={css.nameInput}
                onChange={this.handleNameChange.bind(this)}
                onFocus={this.focusInput.bind(this)}
                onBlur={this.blurInput.bind(this)}
                disabled={!this.props.isChangable} />
            {props.children}
            {this.props.rightSockets}
          </div>
        </div>
        <div ref="toolbar"
            style={css.toolbar}>
          {props.showColorInput ? <input ref="colorInput"
              key="colorInput"
              type="text"
              value={this.state.color}
              style={css.colorInput}
              onChange={this.handleColorChange.bind(this)}
              onFocus={this.focusInput.bind(this)}
              onBlur={this.blurInput.bind(this)}
              disabled={!this.props.isChangable} /> : null}
          {props.isRemovable && props.showRemoveButton ? <a ref="remove"
              style={css.remove}
              onMouseDown={this.stopEventPropagation}
              onTouchTap={this.removePanel.bind(this)}
              className="fa fa-remove"
              title="Remove" /> : null}
          {props.isResizable && props.showResizeButton ? <a ref="resize"
              style={css.resize}
              onMouseOver={this.setHoverState.bind(this, true, 100)}
              onMouseOut={this.setHoverState.bind(this, false, 1000)}
              onMouseDown={this.resizePanel.bind(this)}
              className="fa fa-arrows-alt"
              title="Resize" /> : null}
        </div>
      </div>
    );
  }

  css = {
    colorInput: {
      position: 'absolute',
      left: 0,
      top: 0
    },
    content: {
      height: '100%',
      overflow: 'auto',
      position: 'relative',
      width: 'auto'
    },
    inputs: {
      background: 'transparent',
      border: 'none',
      color: 'inherit',
      marginRight: '1ex',
      marginTop: -5,
      maxWidth: '70%',
      overflow: 'hidden',
      padding: 5,
      textOverflow: 'ellipsis',
      transition: 'all 0.4s ease-out',
      whiteSpace: 'nowrap',
      ':focus': {
        textOverflow: 'clip',
        color: 'black',
        background: 'white',
        outline: 'inset 2px rgba(127, 127, 127, 0.5)'
      }
    },
    nameInput: {},
    remove: {
      clear: 'both',
      color: 'inherit',
      padding: 20,
      position: 'absolute',
      right: -20,
      top: -20,
      visibility: 'hidden'
    },
    resize: {
      clear: 'both',
      color: 'inherit',
      padding: 20,
      cursor: 'nwse-resize',
      position: 'absolute',
      right: -20,
      top: -20,
      visibility: 'hidden'
    },
    root: {
      left: 0,
      position: 'absolute',
      top: 0
    },
    toolbar: {
      position: 'relative'
    },
    wrapper: {
      borderColor: 'rgba(255, 255, 255, 0.6)',
      borderRadius: 14,
      borderStyle: 'solid',
      borderWidth: '3px',
      boxSizing: 'border-box',
      height: '100%',
      overflow: 'hidden',
      padding: 5,
      transition: 'border 0.4s ease-out',
      width: 'auto'
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
    text[color.dark() ? 'lighten' : 'darken'](2);

    return {
      colorInput: [
        this.css.inputs,
        props.css.inputs,
        this.css.colorInput,
        props.css.colorInput,
        {width: (this.state.color.length + 1) + 'ex'}
      ],
      content: [
        this.css.content,
        props.css.content
      ],
      // inputs: [
      //   this.css.inputs,
      //   props.css.inputs
      // ],
      nameInput: [
        this.css.inputs,
        props.css.inputs,
        this.css.nameInput,
        props.css.nameInput,
        {width: (this.state.name.length + 1) + 'ex'}
      ],
      remove: [
        this.css.remove,
        {top: -bounds.height - 40},
        this.state.hover ? {visibility: 'visible'} : null,
        props.css.remove
      ],
      resize: [
        this.css.resize,
        this.state.hover ? {visibility: 'visible'} : null,
        props.css.resize
      ],
      root: [
        this.css.root,
        bounds.getCSSTransform(),
        this.state.hover ? {zIndex: 9} : null,
        props.css.root,
        props.style
      ],
      toolbar: [
        this.css.toolbar,
        props.css.toolbar
      ],
      wrapper: [
        this.css.wrapper,
        {
          height: bounds.height,
          borderColor: color.rgbString(),
          backgroundColor: color.clone()
            .alpha(this.state.hover ? 0.5 : 0.25)
            .darken(0.5)
            .rgbaString()
        },
        this.state.selected ? {borderColor: 'red'} : null,
        props.css.wrapper
      ]
    };
  }

  stopEventPropagation(e) { e.stopPropagation(); }

  toggleSelected() {
    let selected = !this.state.selected;
    this.setState({ selected });
    this.graphCanvas.updateSelection(selected, this.props.parent || this);
    if (this.props.onSelect) {
      this.props.onSelect(selected);
    }
  }

  focusInput(e) {
    e.currentTarget.focus();
    this.forceUpdate();
  }

  blurInput(e) {
    e.currentTarget.blur();
    this.forceUpdate();
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
    if (this.props.onChange) {
      clearTimeout(this.onChangeTimer);
      this.onChangeTimer = setTimeout(() => {
        this.props.onChange(this.props.parent, this);
      }, 2000);
    }
  }

  handleColorChange(event) {
    this.setState({color: event.target.value});
    clearTimeout(this.onChangeTimer);
    this.onChangeTimer = setTimeout(() => {
      this.props.onChange(this.props.parent, this);
    }, 50);
  }

  setHoverState(bool, sleep, e) {
    if (e) { e.stopPropagation(); }
    clearTimeout(this.hoverTimer);
    sleep = 0;
    this.hoverTimer = setTimeout(() => this.setState({hover: bool}), sleep || 0);
  }

  removePanel(e) {
    e.stopPropagation();
    // if (!this.props.confirmRemove) {
    return this.destroyPanel();
    // }
    // TODO: use ConfirmDialog
    // this.setState({confirmRemove: true});
    // let confirmProps = {
    //   callback: (ok) => {
    //     if (ok) { remove(); }
    //   },
    //   children: 'Are you sure you want to delete this node?',
    //   title: 'Confirm Delete:'
    // };
    // ConfirmDialog.create(confirmProps);
  }

  destroyPanel() {
    this.setState({removed: true});
    this.graphCanvas.unregister(this);
    let links = this.graphCanvas.lookupLinks(this.id);
    links.forEach(link => link.destroyLink());
    if (this.props.onRemove) { this.props.onRemove(this); }
    if (this.props.onRemovePanel) {
      this.props.onRemovePanel();
    }
  }

  movePanel(e) {
    let pushFrame = (event, dragState) => {
      dragState.frames = dragState.frames || [];
      let index = dragState.frames.length,
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
    e.stopPropagation();
    if (e.target.tagName === 'INPUT') { return; }
    this.graphCanvasViewport.setupClickDrag({
      down: (event, dragState) => {
        this.setState({moving: true});
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
        event.preventDefault(); // prevent text selection;
        clearInterval(this.moveRepeat);
        let duration = (event.timeStamp || Date.now()) - dragState.start;
        if (duration < 200) { return; }
        event.stopPropagation();
        let lastX = dragState.lastMove.x,
            lastY = dragState.lastMove.y;
        dragState.lastMove = {
          x: event.relX,
          y: event.relY
        };
        pushFrame(event, dragState);
        let displace = new Vector(lastX - event.relX, lastY - event.relY).squish(this.graphCanvas.scale).negate();
        this.updateBounds(this.state.bounds.clone().translate(displace));
        this.moveRepeat = setInterval(() => {
          pushFrame(event, dragState);
        }, 32);
      },
      up: (event, dragState) => {
        clearInterval(this.moveRepeat);
        this.setState({moving: false});
        let duration = (event.timeStamp || Date.now()) - dragState.start;
        if (duration < 250) { return this.toggleSelected(); }
        pushFrame(event, dragState);
        let velocitySum = dragState.frames.reduce((lastValue, currFrame) => {
          return (lastValue.velocity || lastValue).add(currFrame.velocity);
        });
        velocitySum = velocitySum.squish(dragState.frames.length / 2);
        this.stopPhysicsMove = false;
        let tick = () => {
          if (Math.abs(velocitySum.x) < 0.001 &&
              Math.abs(velocitySum.y) < 0.001) { return; }
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
    this.graphCanvasViewport.setupClickDrag({
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
        event.preventDefault();
        let lastX = dragState.lastMove.x,
            lastY = dragState.lastMove.y;
        dragState.lastMove = {
          x: event.relX,
          y: event.relY
        };
        let displace = new Vector(lastX - event.relX, lastY - event.relY).squish(this.graphCanvas.scale).negate(),
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
    this.updateLinks();
    if (this.props.onUpdateBounds) {
      this.props.onUpdateBounds(bounds);
    }
  }

  updateLinks() {
    let links = this.graphCanvas.lookupLinks(this.id);
    links.forEach(link => link.updateBounds());
  }

}
