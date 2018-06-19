// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import Infinite from 'react-infinite';

import ConsoleItem from './ConsoleItem';

export default class Console extends Component {

  static defaultProps = {
    elements: [],
    handleInfiniteLoad: (cb) => { throw new Error('No handleInfiniteLoad'); },
    height: 200,
    mapper: (item, i) => item && <ConsoleItem key={i + '_' + item.timestamp} {...item} />
  };

  state = {
    elements: this.props.elements,
    isInfiniteLoading: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.elements && nextProps.elements !== this.state.elements) {
      this.setState({elements: nextProps.elements});
    }
  }

  handleInfiniteLoad() {
    if (this.state.isInfiniteLoading === true) {
      return;
    }
    this.setState({isInfiniteLoading: true}, () => {
      this.props.handleInfiniteLoad(() => {
        this.setState({isInfiniteLoading: false});
      });
    });
  }

  elementInfiniteLoad() {
    return <div style={{height: 40}}>
      <span>Loading...</span>
    </div>;
  }

  render() {
    let { props, state } = this;

    return (
      <div className="Console" style={{
        background: 'black',
        borderRadius: 5,
        boxSizing: 'border-box',
        height: props.height,
        overflow: 'hidden',
        padding: 5,
        transition: 'height 1s'
      }}>
        <Infinite
            elementHeight={40}
            containerHeight={props.height - 10}
            infiniteLoadBeginEdgeOffset={200}
            onInfiniteLoad={this.handleInfiniteLoad.bind(this)}
            loadingSpinnerDelegate={this.elementInfiniteLoad()}
            isInfiniteLoading={this.state.isInfiniteLoading}
            displayBottomUpwards={true}>
          {state.elements.length ? state.elements.map(props.mapper) : '(console empty)'}
        </Infinite>
      </div>
    );
  }

}
