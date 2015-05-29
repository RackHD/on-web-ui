'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorateComponent from '../lib/decorateComponent';
/* eslint-enable no-unused-vars */

import onReady from '../../lib/onReady';
import { Styles } from 'material-ui';

var testContainer = document.createElement('div');
testContainer.setAttribute('id', (testContainer.id = 'tests'));

onReady(function() {
  document.body.appendChild(testContainer);
});

const ThemeManager = new Styles.ThemeManager();

@decorateComponent({
  propTypes: {
    disableAutoTheme: PropTypes.bool,
    TestComponent: PropTypes.func,
    componentProps: PropTypes.object,
    done: PropTypes.func
  },
  defaultProps: {
    disableAutoTheme: false,
    componentProps: {}
  },
  childContextTypes: {
    muiTheme: PropTypes.object
  }
})
export default class TestWrapper extends Component {

  static testRender(TestComponent, componentProps, done, disableAutoTheme) {
    var testWrapper = <TestWrapper
      disableAutoTheme={!!disableAutoTheme}
      TestComponent={TestComponent}
      componentProps={componentProps}
      done={done}
    />;
    return React.render(testWrapper, testContainer);
  }

  static testCleanup(done) {
    clearTimeout(this.cleanupTimer);
    this.cleanupTimer = setTimeout(function() {
      if (!React.unmountComponentAtNode(testContainer)) {
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

  getDOMNode() { return React.findDOMNode(this); }

  getChildContext() {
    return this.props.disableAutoTheme ? {} : {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  get component() {
    return this.refs.component;
  }

  componentWillMount() {
    // console.log('Test wrapper will mount.', this.props);
  }

  componentDidMount() {
    if (this.props.done) {
      this.props.done(null, this.component);
    }
  }

  render() {
    if (this.state.disabled) { return null; }
    var { TestComponent, componentProps } = this.props,
        styles = {
          background: 'rgba(255, 255, 255, 0.75)',
          minHeight: '20%',
          position: 'absolute',
          padding: 10,
          zIndex: 1,
          border: '2px dotted rgba(255, 0, 0, 0.25)',
          width: '80%',
          left: '10%',
          top: '5%'
        };
    return (
      <div className="TestWrapper" style={styles}>
        {<TestComponent ref="component" {...componentProps} />}
      </div>
    );
  }

}
