'use strict';

import React from 'react';

import Vector from '../lib/Vector';

export default {

  bindWindow(event, listener) {
    window.addEventListener(event, listener);
    return this.unbindWindow.bind(this, event, listener);
  },

  unbindWindow(event, listener) {
    window.removeEventListener(event, listener);
  },

  findThisDOMNode() {
    return this.getDOMNode();
  },

  domOffsetXY(element) {
    if (element.getBoundingClientRect) {
      var rect = element.getBoundingClientRect();
      return new Vector(rect.left, rect.top);
    }
    var x = 0,
        y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while(element);
    return new Vector(x, y);
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

  offsetEventXY(event, e=event.nativeEvent || event,
                       d=this.findThisDOMNode(),
                       o=this.domOffsetXY(d)
  ) {
    var x = (e.pageX || e.clientX),
        y = (e.pageY || e.clientY);
    event.relDOM = d;
    event.relX = x - o.x;
    event.relY = y - o.y;
    event.absX = x;
    event.absY = y;
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
      let last = dragState.lastMoveEvent || dragState.downEvent;
      event.diffX = event.absX - last.absX;
      event.diffY = event.absY - last.absY;
      dragState.lastMoveEvent = event;
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
