// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import radium from 'radium';
import mixin from 'src-common/lib/mixin';

import CoordinateHelpers from '../mixins/CoordinateHelpers';

import generateId from '../lib/generateId';
import Vector from '../lib/Vector';

import GCViewport from './Viewport';
import GCWorld from './World';

import GCLinksManager from './LinksManager';

import GCGroupElement from './elements/Group';
import GCLinkElement from './elements/Link';
import GCNodeElement from './elements/Node';
import GCPortElement from './elements/Port';
import GCSocketElement from './elements/Socket';

export { GCGroupElement as GCGroup };
export { GCLinkElement as GCLink };
export { GCNodeElement as GCNode };
export { GCPortElement as GCPort };
export { GCSocketElement as GCSocket };

@radium
@mixin(CoordinateHelpers)
export default class GraphCanvas extends Component {

  static defaultProps = {
    className: 'GraphCanvas',
    css: {},
    grid: {},
    scale: 1,
    x: 0,
    y: 0,
    style: {},
    viewHeight: 600,
    viewWidth: 800,
    worldHeight: 2000,
    worldWidth: 2000,
    onChange: null,
    onSelect: null,
    onLink: null,
    onUnlink: null
  };

  static childContextTypes = {
    graphCanvas: PropTypes.any
  };

  get graphCanvas() {
    return this;
  }

  selected = [];

  index = {_links_: {}};

  componentWillReceiveProps(nextProps) {
    let position = new Vector(this.state.position),
        nextState = null;
    if (nextProps.x) {
      position.x = nextProps.x;
      nextState = nextState || {};
      nextState.position = position;
    }
    if (nextProps.y) {
      position.y = nextProps.y;
      nextState = nextState || {};
      nextState.position = position;
    }
    if (nextProps.scale) {
      nextState = nextState || {};
      nextState.scale = nextProps.scale;
    }
    if (nextState) {
      this.setState(nextState);
    }
  }

  state = {
    position: new Vector(
      this.props.x,
      this.props.y
    ),
    scale: this.props.scale
  };

  css = {
    root: {
      overflow: 'hidden',
      transition: 'width 1s'
    }
  };

  getChildContext() {
    return {
      graphCanvas: this
    };
  }

  render() {
    let { props } = this;

    let css = [this.css.root, this.cssViewSize, props.css.root, props.style];

    return (
      <div className={props.className} style={css}>
        <GCLinksManager ref="links" />

        <GCViewport ref="viewport">
          <GCWorld ref="world" grid={this.props.grid}>
            {this.props.children}
          </GCWorld>
        </GCViewport>
      </div>
    );
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

  updatePosition(position) {
    this.setState({ position },
      () => this.props.onChange && this.props.onChange(this));
  }

  updateScale(scale, callback) {
    this.setState({ scale }, () => {
      this.props.onChange && this.props.onChange(this);
      callback && callback();
    });
  }

  updateSelection(selected, element) {
    let index = this.selected.indexOf(element);
    if (selected) {
      if (index === -1) { this.selected.push(element); }
    }
    else if (index !== -1) { this.selected.splice(index, 1); }
    if (this.props.onSelect) { this.props.onSelect(this.selected); }
  }

  lookup(id, throwWhenMissing) {
    let obj = this.index[id];
    if (!obj) {
      let err = new Error('GraphCanvas: Unable to find element with id: ' + id);
      err.gcIsSafe = true;
      if (throwWhenMissing) throw err;
      else console.warn(err);
    }
    else if (obj.matches) {
      if (obj.matches.length === 1) { return obj.matches[0]; }
      console.warn('GraphCanvas lookup returned multitple elements for an id.');
      return obj.matches;
    }
  }

  register(child) {
    let id = child.id = child.id || generateId();
    let obj = this.index[id] = (this.index[id] || {matches: []});
    if (obj.matches.indexOf(child) === -1) {
      obj.matches.push(child);
    }
  }

  unregister(child) {
    let id = child.id;
    if (!id) {
      throw new Error('GraphCanvas: Cannot unregister invalid child without id.');
    }
    let obj = this.index[id];
    if (obj && obj.matches) {
      let index = obj.matches.indexOf(child);
      if (index !== -1) {
        obj.matches.splice(index, 1);
      }
    }
  }

  lookupLinks(id) {
    let scope = this.index._links_ = this.index._links_ || {},
        subindex = scope[id],
        links = {};
    Object.keys(subindex || {}).forEach(otherEnd => {
      otherEnd = subindex[otherEnd];
      Object.keys(otherEnd || {}).forEach(linkId => {
        links[linkId] = otherEnd[linkId];
      });
    });
    return Object.keys(links).map(linkId => links[linkId]);
  }

  associate(scope, a, b, id, value) {
    if (!a || !b) { return; }
    a = a.id || a;
    b = b.id || b;
    scope[a] = scope[a] || {};
    scope[a][b] = scope[a][b] || {};
    if (value) { scope[a][b][id] = value; }
    else { delete scope[a][b][id]; }
  }

  associateLinkConcept(linkTo, linkFrom, linkId, value) {
    let scope = this.index._links_ = this.index._links_ || {};

    let toSocket = this.lookup(linkTo);
    if (!toSocket.context) { return; }

    let toPort = toSocket.context.parentGCPort;
    let toNode = toSocket.context.parentGCNode;
    let toGroup = toSocket.context.parentGCGroup;

    let fromSocket = this.lookup(linkFrom);
    if (!fromSocket.context) { return; }

    let fromPort = fromSocket.context.parentGCPort;
    let fromNode = fromSocket.context.parentGCNode;
    let fromGroup = fromSocket.context.parentGCGroup;

    this.associate(scope, fromSocket, toSocket, linkId, value);
    this.associate(scope, toSocket, fromSocket, linkId, value);

    this.associate(scope, fromPort, toPort, linkId, value);
    this.associate(scope, toPort, fromPort, linkId, value);

    this.associate(scope, fromNode, toNode, linkId, value);
    this.associate(scope, toNode, fromNode, linkId, value);

    this.associate(scope, fromGroup, toGroup, linkId, value);
    this.associate(scope, toGroup, fromGroup, linkId, value);

    if (findDOMNode(fromSocket).parentNode) {
      fromSocket.forceUpdate();
    }

    if (findDOMNode(toSocket).parentNode) {
      toSocket.forceUpdate();
    }
  }

  associateLink(link, value) {
    if (value === undefined) { value = link; }

    this.associateLinkConcept(link.state.to, link.state.from, link.id, value);
  }

  forgetLinkAssociation(link) {
    this.associateLink(link, null);
  }

  emitters = {add: {}, remove: {}};

  emitLink(link) {
    if (this.emitters.add[link.id]) { return; }
    this.emitters.add[link.id] = true;
    if (this.props.onLink) { this.props.onLink(link); }
  }

  emitUnlink(link) {
    if (this.emitters.remove[link.id]) { return; }
    this.emitters.remove[link.id] = true;
    if (this.props.onUnlink) { this.props.onUnlink(link); }
  }

}
