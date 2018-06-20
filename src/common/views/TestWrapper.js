// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import { render, unmountComponentAtNode, findDOMNode } from 'react-dom';

import emcTheme from '../lib/emcTheme';
import onReady from '../lib/onReady';

let testContainer = document.createElement('div');
testContainer.setAttribute('id', (testContainer.id = 'tests'));

onReady(() => {
  document.body.appendChild(testContainer);
});

export default class TestWrapper extends Component {

  static propTypes = {
    disableAutoTheme: PropTypes.bool,
    TestComponent: PropTypes.func,
    componentProps: PropTypes.object,
    doneDelay: PropTypes.number,
    done: PropTypes.func
  };

  static defaultProps = {
    doneDelay: 16,
    disableAutoTheme: false,
    componentProps: {}
  };

  static childContextTypes = {
    muiTheme: PropTypes.any
  };

  static testRender(TestComponent, componentProps, done, disableAutoTheme) {
    try {
      let testWrapper = <TestWrapper
        disableAutoTheme={!!disableAutoTheme}
        TestComponent={TestComponent}
        componentProps={componentProps}
        done={done} />;
      return render(testWrapper, testContainer);
    } catch (err) {
      console.log('TestWrapper error:');
      console.error(err);
      done(err);
    }
  }

  static testCleanup(done) {
    clearTimeout(this.cleanupTimer);
    this.cleanupTimer = setTimeout(() => {
      if (!unmountComponentAtNode(testContainer)) {
        throw new Error('TestWrapper: Container element is not mounted.');
      }
      if (done) { setTimeout(done, 0); }
    }, 0);
  }

  state = {disabled: false};

  cleanup(done, componentOnly) {
    this.setState({disabled: true});
    if (!componentOnly) { TestWrapper.testCleanup(done); }
  }

  getDOMNode() { return findDOMNode(this); }

  getChildContext() {
    if (!this.props.disableAutoTheme) {
      return {muiTheme: emcTheme};
    }
    return {};
  }

  get component() {
    return this.refs.component;
  }

  componentWillMount() {
    // console.log('Test wrapper will mount.', this.props);
  }

  componentDidMount() {
    if (this.props.done) {
      setTimeout(() => this.props.done(null, this.component), this.props.doneDelay);
    }
  }

  render() {
    try {
      if (this.state.disabled) { return null; }
      let { TestComponent, componentProps } = this.props,
          styles = {
            background: 'rgba(255, 255, 255, 0.75)',
            minHeight: '40%',
            position: 'absolute',
            padding: 10,
            zIndex: 1,
            border: '2px dotted rgba(255, 0, 0, 0.25)',
            width: '90%',
            left: '5%',
            top: '5%'
          };
      return (
        <div className="TestWrapper" style={styles}>
          <TestComponent ref="component" {...componentProps} />
        </div>
      );
    } catch (err) {
      console.log('TestWrapper-render error:');
      console.error(err);
    }
  }

}
