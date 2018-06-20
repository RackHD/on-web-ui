// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

@radium
export default class HorizontalSplitView extends Component {

  static defaultProps = {
    a: (cellSize, splitView) => 'A',
    b: (cellSize, splitView) => 'B',
    orientation: 'horizontal',
    className: '',
    collapsable: true,
    collapse: 0,
    css: {},
    dividerSize: 10,
    height: '100%',
    invert: false,
    onUpdate: null,
    resizable: true,
    ratio: true,
    split: 0.5,
    style: {},
    width: '100%'
  };

  static contextTypes = {
    appContainer: PropTypes.any,
    parentSplit: PropTypes.any
  };

  static childContextTypes = {
    parentSplit: PropTypes.any
  };

  getChildContext() {
    return {
      parentSplit: this
    };
  }

  resizeTimer = null;

  componentWillReceiveProps(nextProps) {
    if (nextProps.split) {
      this.setState({split: nextProps.split});
    }
  }

  state = {
    resizing: false,
    split: this.props.split,
    toggleSplit: this.props.collapse
  };

  get height() {
    if (typeof this.props.height === 'number') return this.props.height;
    if (this.context.parentSplit) return this.context.parentSplit.height;
    if (this.context.appContainer) return this.context.appContainer.state.height;
    return window.innerHeight;
  }

  get width() {
    if (typeof this.props.width === 'number') return this.props.width;
    if (this.context.parentSplit) return this.context.parentSplit.width;
    if (this.context.appContainer) return this.context.appContainer.state.width;
    return window.innerWidth;
  }

  get size() {
    return this.props.orientation === 'horizontal' ? this.width : this.height;
  }

  get splitA() {
    let { size, props, state } = this;
    let split = props.ratio ? state.split : state.split / size;
    return props.invert ? 1 - split : split;
  }

  get splitB() {
    let { size, props, state } = this;
    let split = props.ratio ? 1 - state.split : (size - state.split) / size;
    return props.invert ? 1 - split : split;
  }

  css = {
    root: {
      position: 'relative',
      overflow: 'hidden'
    },

    a: {
      overflow: 'hidden'
    },

    b: {
      overflow: 'hidden'
    },

    resize: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10,
      overflow: 'hidden'
    }
  };

  render() {
    let { props, state } = this;

    let split = this.splitA,
        size = this.size,
        sizeA = split * this.size,
        sizeB = this.splitB * size,
        isCollapsed = split === 0 || split === 1,
        dividerSize = props.dividerSize;

    let a, b, resize;

    if (props.orientation === 'horizontal') {
      a = {width: sizeA, height: this.height};
      b = {width: sizeB, height: this.height,
            left: sizeA, position: 'absolute', top: 0};
      resize = {
        left: sizeA,
        height: this.height,
        width: isCollapsed ? dividerSize * 2 : dividerSize,
        marginLeft: isCollapsed ? -dividerSize : -dividerSize / 2
      };
    }

    else {
      a = {height: sizeA, width: this.width};
      b = {height: sizeB, width: this.width};
      resize = {
        top: sizeA,
        width: this.width,
        height: isCollapsed ? dividerSize * 2 : dividerSize,
        marginTop: isCollapsed ? -dividerSize : -dividerSize / 2
      };
    }

    resize.background = props.resizable || props.collapsable ?
      'rgba(127,127,127,0.33)' :
      'rgba(127,127,127,0.66)';

    resize.cursor =
      props.resizable ?
        (props.orientation === 'horizontal' ? 'col-resize' : 'row-resize') :
        (props.collapsable ? 'pointer' : 'default');

    // resize[':hover'] = (this.props.resizable || this.props.collapsable) && {
    //   background: 'rgba(127,127,127,0.66)'
    // } || null;

    let resizeFix = state.resizing && {transition: null};

    let css = {
      root: [
        this.css.root,
        {width: props.width, height: props.height},
        props.css.root,
        resizeFix,
        this.props.style
      ],

      a: [this.css.a, a, props.css.a, resizeFix],
      b: [this.css.b, b, props.css.b, resizeFix],

      resize: [
        this.css.resize,
        resize,
        props.css.resize,
        resizeFix
      ]
    };

    let className = ['SplitView',
      this.props.orientation,
      props.className
    ].join(' ');

    return (
      <div ref="sv" className={className} style={css.root}>
        <div ref="a" className="a" style={css.a}>{props.a(a, this)}</div>
        <div ref="b" className="b" style={css.b}>{props.b(b, this)}</div>
        <div ref="r" className="resize" style={css.resize}
            onMouseDown={this.resizeSplitView}
            onDoubleClick={this.toggleSplitView}></div>
      </div>
    );
  }

  emitUpdate = () => {
    if (this.props.onUpdate) { this.props.onUpdate(this); }
  };

  toggleSplitView = () => {
    if (!this.props.collapsable) return;

    let { props, state } = this;

    if (this.splitA !== (props.invert ? 1 - props.collapse : props.collapse)) {
      this.setState({
        split: props.ratio ? props.collapse : this.size * props.collapse,
        toggleSplit: state.split
      }, this.emitUpdate);
    }

    else {
      this.setState({
        split: state.toggleSplit === state.split ?
          props.split :
          state.toggleSplit,
        toggleSplit: state.split
      }, this.emitUpdate);
    }
  };

  resizeSplitView = (event) => {
    if (!this.props.resizable) {
      if (this.props.collapsable) { this.toggleSplitView(event); }
      return;
    }

    let active = true,
        pageX = event.pageX,
        pageY = event.pageY,
        split = this.splitA,
        {props, size} = this;

    event.preventDefault();
    event.stopPropagation();

    let moveHandler = (e) => {
      if (!active) { return; }

      e.preventDefault();
      e.stopPropagation();

      let diffX = e.pageX - pageX,
          diffY = e.pageY - pageY,
          newSplit;

      if (props.orientation === 'horizontal') {
        diffX = diffX / size;
        newSplit = Math.max(0, Math.min(1, split + diffX));
      }

      else {
        diffY = diffY / size;
        newSplit = Math.max(0, Math.min(1, split + diffY));
      }

      if (!props.ratio) {
        newSplit = size * newSplit;
        if (props.invert) newSplit = size - newSplit;
      }

      this.setState({split: newSplit}, this.emitUpdate);
    };

    let upHandler = () => {
      active = false;
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
      this.setState({resizing: false});
    };

    this.setState({resizing: true}, () => {
      window.addEventListener('mousemove', moveHandler);
      window.addEventListener('mouseup', upHandler);
    });
  };

}
