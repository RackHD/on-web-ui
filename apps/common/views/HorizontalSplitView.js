// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

@radium
export default class HorizontalSplitView extends Component {

  static defaultProps = {
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
    // parentSplit: PropTypes.any
  };

  // static childContextTypes = {
  //   parentSplit: PropTypes.any
  // };

  // getChildContext() {
  //   return {
  //     parentSplit: this
  //   };
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.split) {
      this.setState({split: nextProps.split});
    }
  }

  state = {
    toggleSplit: null,
    split: this.props.split
  };

  get width() {
    if (typeof this.props.width === 'number') {
      return this.props.width;
    }
    // if (this.context.parentSplit) {
    //   return this.context.parentSplit.width;
    // }
    if (this.context.appContainer) {
      return this.context.appContainer.state.width;
    }
    if (this.refs.root) {
      if (this.refs.root.parentNode) {
        return this.refs.root.parentNode.offsetWidth;
      }
      return this.refs.root.offsetWidth;
    }
    return window.innerWidth;
  }

  get leftSplit() {
    let split = !this.props.ratio ?
      this.state.split / this.width :
      this.state.split
    // console.log('left', split, 1 - split);
    return this.props.invert ? 1 - split : split;
  }

  get rightSplit() {
    let split = !this.props.ratio ?
      (this.width - this.state.split) / this.width :
      1 - this.state.split;
    // console.log('right', split, 1 - split);
    return this.props.invert ? 1 - split : split;
  }

  css = {
    root: {
      width: this.props.width,
      height: this.props.height,
      position: 'relative'
    },

    line: {
      width: 'inherit',
      height: 'inherit'
    },

    left: {
      width: this.leftSplit * 100 + '%',
      height: 'inherit',
      overflow: 'hidden'
    },

    right: {
      width: this.rightSplit * 100 + '%',
      height: 'inherit',
      overflow: 'hidden'
    },

    resize: {
      height: 'inherit',
      width: this.props.dividerSize,
      marginLeft: -this.props.dividerSize / 2,
      background: this.props.resizable || this.props.collapsable ? 'rgba(127,127,127,0.33)' : 'rgba(127,127,127,0.66)',
      cursor: this.props.resizable ? 'col-resize' : this.props.collapsable ? 'pointer' : 'default',
      position: 'absolute',
      top: 0,
      left: this.leftSplit * 100 + '%',
      zIndex: 10,
      overflow: 'hidden',

      ':hover': this.props.resizable || this.props.collapsable ? {
        background: 'rgba(127,127,127,0.66)',
      } : null
    }
  };

  render() {
    let { props } = this;

    let split = this.leftSplit,
        leftSize = (split * 100) + '%',
        rightSize = (this.rightSplit * 100) + '%',
        isCollapsed = split === 0 || split === 1,
        dividerSize = this.props.dividerSize;

    console.log('GOT HERE', leftSize, rightSize);

    let css = {
      root: [
        this.css.root,
        {width: props.width, height: props.height},
        props.css.root,
        this.props.style
      ],

      line: [
        this.css.line,
        props.css.line
      ],

      left: [this.css.left, {width: leftSize}, props.css.left],
      right: [this.css.right, {width: rightSize}, props.css.right],

      resize: [
        this.css.resize,
        {
          left: leftSize,
          width: isCollapsed ? dividerSize * 2 : dividerSize,
          marginLeft: isCollapsed ? -dividerSize : -dividerSize / 2
        },
        props.css.resize
      ]
    };

    return (
      <div ref="root"
          className={'HorizontalSplitView ungrid ' + props.className}
          style={css.root}>

        <div className="line"
            style={css.line}>

          <div ref="left"
              className="cell"
              style={css.left}>
            {props.left || props.children && props.children[0]}
          </div>

          <div ref="right"
              className="cell"
              style={css.right}>
            {props.right || props.children && props.children[1]}
          </div>
        </div>

        <div ref="resize"
            style={css.resize}
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

    if (state.toggleSplit !== null || this.leftSplit === props.collapse) {
      console.log("GOT HERE 2", this.props.split, state.toggleSplit);
      this.setState({
        split: state.toggleSplit === state.split ? this.props.split : state.toggleSplit,
        toggleSplit: null
      }, this.emitUpdate);
    }

    else {
      console.log('GOT HERE', this.props.collapse, this.width * this.props.collapse);
      this.setState({
        split: this.props.ratio ? this.props.collapse : this.width * this.props.collapse,
        toggleSplit: this.leftSplit
      }, this.emitUpdate);
    }
  };

  resizeSplitView = (event) => {
    if (!this.props.resizable) return;

    let active = true,
        pageX = event.pageX,
        split = this.leftSplit,
        size = this.width;

    event.preventDefault();
    event.stopPropagation();

    let moveHandler = (e) => {
      if (!active) { return; }

      e.preventDefault();
      e.stopPropagation();

      let diffX = (e.pageX - pageX) / size,
          newSplit = Math.max(0, Math.min(1, split + diffX));

      console.log("DRAG", diffX, newSplit);

      this.setState({
        split: this.props.ratio ? newSplit : this.width * newSplit,
        toggleSplit: null
      }, this.emitUpdate);
    };

    let upHandler = () => {
      active = false;
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
  };

}
