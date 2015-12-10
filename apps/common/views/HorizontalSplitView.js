// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

@radium
export default class HorizontalSplitView extends Component {

  static propTypes = {
    className: PropTypes.string,
    collapse: PropTypes.number,
    css: PropTypes.object,
    height: PropTypes.any,
    onUpdate: PropTypes.func,
    split: PropTypes.number,
    style: PropTypes.object,
    width: PropTypes.any
  };

  static defaultProps = {
    className: '',
    collapse: 0,
    css: {},
    height: '100%',
    onUpdate: null,
    split: 0.5,
    style: {},
    width: '100%'
  };

  state = {
    split: this.props.split,
    lastSplit: null
  }

  get width() {
    return this.refs.root.offsetWidth;
  }

  get leftSplit() {
    return this.state.split;
  }

  get rightSplit() {
    return 1 - this.state.split;
  }

  css = {
    root: {
      width: '100%',
      height: '100%',
      position: 'relative'
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
      width: 10,
      marginLeft: -5,
      background: 'rgba(127,127,127,0.33)',
      cursor: 'col-resize',
      position: 'absolute',
      top: 0,
      left: this.leftSplit * 100 + '%',
      zIndex: 10,
      overflow: 'hidden',

      ':hover': {
        background: 'rgba(127,127,127,0.66)',
      }
    }
  }

  render() {
    let { props, state } = this;

    let split = state.split,
        leftSize = (split * 100) + '%',
        rightSize = (this.rightSplit * 100) + '%',
        isCollapsed = split === 0 || split === 1;

    let css = {
      root: [
        this.css.root,
        {width: props.width, height: props.height},
        props.css.root,
        this.props.style
      ],

      left: [this.css.left, {width: leftSize}, props.css.left],
      right: [this.css.right, {width: rightSize}, props.css.right],

      resize: [
        this.css.resize,
        {left: leftSize,
          width: isCollapsed ? 20 : 10, marginLeft: isCollapsed ? -10 : -5},
        props.css.resize
      ]
    };

    return (
      <div ref="root"
          className={'HorizontalSplitView ungrid ' + props.className}
          style={css.root}>

        <div className="line"
            style={props.css.line}>

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
    let { props, state } = this;
    if (state.lastSplit !== null || state.split === props.collapse) {
      this.setState({
        split: state.lastSplit === null || state.lastSplit === state.split ? 0.5 : state.lastSplit,
        lastSplit: null
      }, this.emitUpdate);
    }
    else {
      this.setState({split: this.props.collapse, lastSplit: this.state.split}, this.emitUpdate);
    }
  }

  resizeSplitView = (event) => {
    let active = true,
        pageX = event.pageX,
        split = this.state.split,
        size = this.width;

    event.preventDefault();
    event.stopPropagation();

    let moveHandler = (e) => {
      if (!active) { return; }

      e.preventDefault();
      e.stopPropagation();

      let diffX = (e.pageX - pageX) / size,
          newSplit = Math.max(0, Math.min(1, split + diffX));

      this.setState({split: newSplit, lastSplit: null}, this.emitUpdate);
    };

    let upHandler = () => {
      active = false;
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
  }

}
