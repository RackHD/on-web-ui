// Copybottom 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

@radium
export default class VerticalSplitView extends Component {

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
      this.setState({
        split: nextProps.split
      });
    }
  }

  state = {
    toggleSplit: null,
    split: this.props.split
  };

  get height() {
    if (typeof this.props.width === 'number') {
      return this.props.width;
    }
    // if (this.context.parentSplit) {
    //   return this.context.parentSplit.height;
    // }
    if (this.context.appContainer) {
      return this.context.appContainer.state.height;
    }
    if (this.refs.root) {
      if (this.refs.root.parentNode) {
        return this.refs.root.parentNode.offsetHeight;
      }
      return this.refs.root.offsetHeight;
    }
    return window.innerWidth;
  }

  get topSplit() {
    if (!this.props.ratio) {
      if (this.props.invert) {
        return (this.height - this.state.split) / this.height;
      }
      return this.state.split / this.height;
    }
    return this.state.split;
  }

  get bottomSplit() {
    if (!this.props.ratio) {
      if (this.props.invert) return this.state.split / this.height;
      return (this.height - this.state.split) / this.height;
    }
    return 1 - this.state.split;
  }

  css = {
    root: {
      width: this.props.width,
      height: this.props.height,
      position: 'relative'
    },

    top: {
      height: this.topSplit * 100 + '%',
      width: 'inherit',
      overflow: 'hidden'
    },

    bottom: {
      height: this.bottomSplit * 100 + '%',
      width: 'inherit',
      overflow: 'hidden'
    },

    resize: {
      height: this.props.dividerSize,
      width: 'inherit',
      marginTop: -this.props.dividerSize / 2,
      background: this.props.resizable || this.props.collapsable ? 'rgba(127,127,127,0.33)' : 'rgba(127,127,127,0.66)',
      cursor: this.props.resizable ? 'row-resize' : this.props.collapsable ? 'pointer' : 'default',
      position: 'absolute',
      left: 0,
      top: this.topSplit * 100 + '%',
      zIndex: 10,
      overflow: 'hidden',

      ':hover': this.props.resizable || this.props.collapsable ? {
        background: 'rgba(127,127,127,0.66)',
      } : null
    }
  };

  render() {
    let { props } = this;

    let split = this.topSplit,
        topSize = (split * 100) + '%',
        bottomSize = (this.bottomSplit * 100) + '%',
        isCollapsed = split === 0 || split === 1,
        dividerSize = this.props.dividerSize;

    let css = {
      root: [
        this.css.root,
        {width: props.width, height: props.height},
        props.css.root,
        this.props.style
      ],

      top: [this.css.top, {height: topSize}, props.css.top],
      bottom: [this.css.bottom, {height: bottomSize}, props.css.bottom],

      resize: [
        this.css.resize,
        {
          top: topSize,
          height: isCollapsed ? dividerSize * 2 : dividerSize,
          marginTop: isCollapsed ? -dividerSize : -dividerSize / 2
        },
        props.css.resize
      ]
    };

    return (
      <div ref="root"
          className={'VerticalSplitView ' + props.className}
          style={css.root}>

          <div ref="top" style={css.top}>
            {props.top || props.children && props.children[0]}
          </div>

          <div ref="bottom" style={css.bottom}>
            {props.bottom || props.children && props.children[1]}
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
    let split;
    if (state.toggleSplit !== null || this.topSplit === props.collapse) {
      split = this.props.split;
      this.setState({
        split: (state.toggleSplit === state.split) ? split : state.toggleSplit,
        toggleSplit: null
      }, this.emitUpdate);
    }
    else {
      split = this.props.ratio ? this.props.collapse : this.height * this.props.collapse;
      this.setState({
        split: split,
        toggleSplit: this.leftSplit
      }, this.emitUpdate);
    }
  };

  resizeSplitView = (event) => {
    let active = true,
        pageY = event.pageY,
        split = this.topSplit,
        size = this.height;

    event.preventDefault();
    event.stopPropagation();

    let moveHandler = (e) => {
      if (!active) { return; }

      e.preventDefault();
      e.stopPropagation();

      let diffY = (e.pageY - pageY) / size,
          newSplit = Math.max(0, Math.min(1, split + diffY));

      this.setState({
        split: this.props.ratio ? newSplit : this.height * newSplit,
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
