'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DragEventHelpers from '../../mixins/DragEventHelpers';
/* eslint-enable no-unused-vars */

// import Vector from '../../lib/Vector';

// import Group from '../../lib/Graph/Group';
// import GraphCanvasGroup from '../elements/Group';

@decorate({
  propTypes: {},
  defaultProps: {},
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
@mixin.decorate(DragEventHelpers)
export default class GCGroupsManager extends Component {

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  // groups = this.graphCanvas.props.initialGroups;
  // // activeGroup = null;

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }

  // register(group) {
  //   var groups = this.groups;
  //
  //   if (this.groups.indexOf(group) === -1) {
  //     groups = this.groups = groups.concat([group]);
  //   }
  //
  //   this.graphCanvas.setState({ groups });
  // }
  //
  // removeGroup() {}

  // drawGroup() {
  //   return this.setupClickDrag({
  //     down: (event, dragState) => {
  //       event.stopPropagation();
  //       event.preventDefault();
  //       var dom = React.findDOMGroup(this);
  //       dragState.group = new Group({
  //         graph: this.graph,
  //         bounds: this.getEventCoords(event, dom),
  //         layer: 1,
  //         scale: 1,
  //         ports: [
  //           {name: 'Flow', sockets: [
  //             {type: 'Signal', dir: [-1, 0]},
  //             {type: 'Failure', dir: [1, 0]},
  //             {type: 'Success', dir: [1, 0]},
  //             {type: 'Complete', dir: [1, 0]}
  //           ]}
  //         ]
  //       });
  //       dragState.group.bounds.max = dragState.group.bounds.min;
  //     },
  //     move: (event, dragState) => {
  //       if (this.state.activeLink) { return; }
  //       event.stopPropagation();
  //       var dom = React.findDOMGroup(this);
  //       dragState.group.bounds.max = this.getEventCoords(event, dom);
  //       this.setState({activeGroup: dragState.group});
  //     },
  //     up: (event, dragState) => {
  //       event.stopPropagation();
  //       var group = dragState.group;
  //       this.setState({activeGroup: null});
  //       this.graphCanvas.graph.add(dragState.group);
  //       this.addGroup(group);
  //     }
  //   });
  // }
  //
  // // Link events
  //
  // getSocketCenter(socketElement) {
  //   var groupElement,
  //       element = socketElement,
  //       // HACK: get ports element of socket.
  //       ports = socketElement.parentGroup.parentGroup.parentGroup
  //                 .parentGroup.parentGroup.parentGroup.parentGroup,
  //       stop = 'GraphCanvasGroup',
  //       x = 0,
  //       y = 0 - ports.scrollTop;
  //   do {
  //     x += element.offsetLeft;
  //     y += element.offsetTop;
  //     if (groupElement) { break; }
  //     if (element.classList.contains(stop)) { groupElement = element; }
  //     element = element.offsetParent;
  //   } while(element);
  //   x += socketElement.clientWidth / 2;
  //   y += socketElement.clientHeight / 2;
  //   var group = this.graph.group(groupElement.dataset.id),
  //       pos = group.bounds.normalPosition;
  //   x += pos.x;
  //   y += pos.y;
  //   return new Vector(x, y);
  // }
  //
  // // List management
  //
  // selectGroup(group, shiftKey) {
  //   this.selected = this.selected || [];
  //   var isSelected = this.selected.indexOf(group) !== -1;
  //   if (!shiftKey) { this.unselectAllGroups(); }
  //   if (isSelected) { return this.unselectGroup(group); }
  //   this.selected.push(group);
  //   group.data = group.data || {};
  //   group.data.selected = true;
  //   if (this.refs[group.id]) {
  //     this.refs[group.id].setState({selected: true});
  //   }
  //   if (this.props.selectionHandler) {
  //     this.props.selectionHandler(this.selected);
  //   }
  //   // this.fixLinkPositions(group._graph.links);
  // }
  //
  // unselectGroup(group) {
  //   group.data = group.data || {};
  //   group.data.selected = false;
  //   if (this.refs[group.id]) {
  //     this.refs[group.id].setState({selected: false});
  //   }
  //   if (this.selected) {
  //     this.selected = this.selected.filter(n => n !== group);
  //   }
  //   if (this.props.selectionHandler) {
  //     this.props.selectionHandler(this.selected);
  //   }
  // }
  //
  // unselectAllGroups() {
  //   if (this.selected) {
  //     this.selected.forEach(n => this.unselectGroup(n));
  //   }
  //   if (this.props.selectionHandler) {
  //     this.props.selectionHandler(this.selected);
  //   }
  // }
  //
  // addGroup(group) {
  //   group.layer = 0;
  //   this.graph.add(group);
  //   this.setState({groups: this.graph.groups});
  // }
  //
  // removeGroup(group) {
  //   this.graph.remove(group);
  //   this.setState({
  //     groups: this.graph.groups,
  //     links: this.graph.links
  //   });
  // }

  // moveGroup(groupRef, displaceX, displaceY) {
  //   var group = this.graph.groups.filter(n => n.id === groupRef)[0],
  //       links = this.graph.links.filter(l => l.data.from === groupRef || l.data.to === groupRef),
  //       displace = new Vector(displaceX, displaceY).squish(this.scale).negate();
  //   group.bounds.translate(displace);
  //   links.forEach(l => {
  //     if (l.data.from === groupRef) {
  //       l.data.bounds.min = l.data.bounds.min.add(displace);
  //     }
  //     else {
  //       l.data.bounds.max = l.data.bounds.max.add(displace);
  //     }
  //   });
  //   this.setState({
  //     groups: this.graph.groups,
  //     links: this.graph.links
  //   });
  // }

}
