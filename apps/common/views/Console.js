// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import Infinite from 'react-infinite';

import ConsoleItem from './ConsoleItem';

export default class Console extends Component {

  static defaultProps = {
    monitor: null,
    // elementHeight: 40,
    height: 200,
    // limit: 512,
    mapper: (item, i) => {
      return item && <ConsoleItem key={i} {...item} />
    },
    // offset: 0,
    elements: []
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
    return;
    this.setState({isInfiniteLoading: true});

    this.props.monitor.load((elements) => {
      this.setState({
        isInfiniteLoading: false,
        elements: elements
      });
    });
  }

  elementInfiniteLoad() {
    return <h2>Loading...</h2>;
  }

  render() {
    let { props, state } = this;

    return (
      <div className="Console" style={{
        background: 'black',
        padding: 5,
        borderRadius: 5
      }}>
        <span style={{color: 'white'}}>Console:</span>

        <div className="Console-logs" style={{
          // padding: 5,
          // maxHeight: 800,
          // minHeight: 20,
          height: props.height - 20,
          transition: 'height 1s',
          overflow: 'hidden'
        }}>
          <Infinite
              elementHeight={40}
              containerHeight={props.height - 20}
              infiniteLoadBeginEdgeOffset={200}
              onInfiniteLoad={this.handleInfiniteLoad.bind(this)}
              loadingSpinnerDelegate={this.elementInfiniteLoad()}
              isInfiniteLoading={this.state.isInfiniteLoading}
              displayBottomUpwards={true}>
            {state.elements.length ?
              state.elements.map(props.mapper) :
              '(empty)'}
          </Infinite>
        </div>
      </div>
    );
  }

}
