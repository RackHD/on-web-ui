// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

export default class JsonDiff extends Component {

  static propTypes = {
    a: PropTypes.any,
    b: PropTypes.any
  };

  static defaultProps = {
    a: null,
    b: null
  };

  state = {
    objectA: this.props.a,
    objectB: this.props.b
  };

  componentWillReceiveProps(nextProps) {
    let nextState = null;

    if (nextProps.a !== this.props.a) {
      nextState = {objectA: nextProps.a};
    }

    if (nextProps.b !== this.props.b) {
      nextState = {objectB: nextProps.b};
    }

    if (nextState) this.setState(nextState);
  }

  render() {
    // console.log(this.state);
    return this.compareTree(this.state.objectA, this.state.objectB);
  }

  compareTree(a, b, name='root') {
    function typeOf(obj) {
      return Array.isArray(obj) ? 'array' : typeof obj;
    }

    function toString(type, val) {
      if (type === 'object' || type === 'array') return '';
      return String(val) + ' ';
    }

    let typeA = typeOf(a),
        typeB = typeOf(b),
        stringA = toString(typeA, a),
        stringB = toString(typeB, b),
        label = null,
        children = null;

    if (a === undefined) {
      // property added
      label = (
        <span style={{background: '#9f9'}}>
          <span>{name}: {stringB} </span>
          <span style={{color: 'gray'}}>{typeB}</span>
        </span>
      );
    }

    else if (b === undefined) {
      // property removed
      label = (
        <span style={{background: '#f99'}}>
          <span>{name}: {stringA} </span>
          <span style={{color: 'gray'}}>{typeA}</span>
        </span>
      );
    }

    else if (typeA !== typeB || (typeA !== 'object' && typeA !== 'array' && a !== b)) {
      // property changed
      label = (
        <span style={{background: '#ff9'}}>
          <span>{name}: {stringA} </span>
          <span style={{color: 'gray'}}>{typeB}</span>
          <span> => {stringB} </span>
          <span style={{color: 'gray'}}>{typeA}</span>
        </span>
      );
    }

    else {
      // property is the same
      label = (
        <span style={{background: 'none'}}>
          <span>{name}: {stringA} </span>
          <span style={{color: '#999'}}>{typeA}</span>
        </span>
      );
    }

    if (typeA === 'object' || typeA === 'array' || typeB === 'object' || typeB === 'array') {
      let keysA = a && typeof a === 'object' ? Object.keys(a) : [],
          keysB = b && typeof b === 'object' ? Object.keys(b) : [],
          allKeys = [].concat(keysA);

      keysB.forEach(key => {
        if (allKeys.indexOf(key) === -1) allKeys.push(key);
      });

      children = (
        <ul>{
          allKeys.sort().map(key => {
            return (
              <li key={key}>
                {this.compareTree(a && a[key], b && b[key], key)}
              </li>
            );
          })
        }</ul>
      );
    }

    return (
      <div className="JsonDiff">
        {label}
        {children || ''}
      </div>
    );
  }

}
