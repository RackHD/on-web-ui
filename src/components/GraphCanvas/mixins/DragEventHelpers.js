'use strict';

import React from 'react';

export default {

  bindWindow(event, listener) {
    window.addEventListener(event, listener);
    return this.unbindWindow.bind(this, event, listener);
  },

  unbindWindow(event, listener) {
    window.removeEventListener(event, listener);
  },

  findThisDOMNode() {
    return React.findDOMNode(this);
  },

  domOffsetXY(element) {
    var x = 0,
        y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while(element);
    return { x, y };
  },

  delegatesTo(element, className) {
    if (!element) { return false; }
    if (element.classList && element.classList.contains(className)) { return element; }
    return this.delegatesTo(element.parentNode, className);
  },

  captureEvent(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
  },

  offsetEventXY(event, e=event.nativeEvent,
                       d=this.findThisDOMNode(),
                       o=this.domOffsetXY(d)
  ) {
    var x = (e.pageX || e.clientX) - o.x,
        y = (e.pageY || e.clientY) - o.y;
    event.relDOM = d;
    event.relX = x;
    event.relY = y;
  },

  dragDownHandler(listeners={}, dragState={}) {
    return (event) => {
      var e = event.nativeEvent || event;
      this.offsetEventXY(event, e,
        dragState.offsetDOMNode,
        dragState.offset);
      dragState.offsetDOMNode = event.relDOM;
      dragState.downEvent = event;
      var unbindMove = this.bindWindow('mousemove', this.dragMoveHandler(listeners.move, dragState)),
          upHandler = this.dragMoveHandler(listeners.up, dragState),
          unbindUp = this.bindWindow('mouseup', finish); // eslint-disable-line no-use-before-define
      function finish(upEvent) {
        console.log('unbind');
        unbindMove();
        unbindUp();
        upHandler(upEvent);
      }
      if (listeners.down) {
        listeners.down.call(this, event, dragState, e);
      }
    };
  },

  dragMoveHandler(moveListener, dragState) {
    return (event) => {
      var e = event.nativeEvent || event;
      this.offsetEventXY(event, e,
        dragState.offsetDOMNode,
        dragState.offset);
      if (moveListener) {
        moveListener.call(this, event, dragState, e);
      }
    };
  },

  dragUpHandler(upListener, dragState) {
    return (event) => {
      var e = event.nativeEvent || event;
      this.offsetEventXY(event, e,
        dragState.offsetDOMNode,
        dragState.offset);
      if (upListener) {
        upListener.call(this, event, dragState, e);
      }
    };
  },

  setupClickDrag(listeners, dragState) {
    return this.dragDownHandler(listeners, dragState);
  }

};
