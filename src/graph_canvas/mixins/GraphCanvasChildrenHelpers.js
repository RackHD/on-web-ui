// Copyright 2015, EMC, Inc.

import React from 'react';

export default {

  prepareChildren(component, vectors, elements) {
    if (!component || !component.props) {
      return component;
    }
    return React.Children.map(component.props.children, child => {
      if (!child) { return null; }
      child = React.cloneElement(child);
      let gcTypeEnum = child && child.type && child.type.GCTypeEnum;
      if (gcTypeEnum) {
        if (gcTypeEnum.vector) {
          if (vectors.indexOf(child) === -1) { vectors.push(child); }
        }
        else if (elements.indexOf(child) === -1) { elements.push(child); }
        return null;
      }
      if (child && child.props) {
        child.props.children = this.prepareChildren(child, vectors, elements);
      }
      return child;
    });
  },

  appendChild(component) {
    let gcTypeEnum = component && component.type &&
      (component.type.GCTypeEnum || component.type.constructor.GCTypeEnum);
    if (!gcTypeEnum) {
      throw new Error('GraphCanvas: Cannot append a child that is not a valid element type.');
    }
    if (gcTypeEnum.vector) {
      this.setState(prevState => {
        let vectors = prevState.vectors.concat([component]);
        return { vectors };
      });
    }
    else {
      this.setState(prevState => {
        let elements = prevState.elements.concat([component]);
        return { elements };
      });
    }
  },

  removeChild(component) {
    let gcTypeEnum = component && component.type &&
      (component.type.GCTypeEnum || component.type.constructor.GCTypeEnum);
    if (!gcTypeEnum) {
      throw new Error('GraphCanvas: Cannot remove a child that is not a valid element type.');
    }
    if (gcTypeEnum.vector) {
      this.setState(prevState => {
        let vectors = prevState.vectors.filter(c => c !== component);
        return { vectors };
      });
    }
    else {
      this.setState(prevState => {
        let elements = prevState.elements.filter(c => c !== component);
        return { elements };
      });
    }
  }

};
