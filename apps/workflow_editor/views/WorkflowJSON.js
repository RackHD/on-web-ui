'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
import JsonEditor from 'common-web-ui/views/JsonEditor';

import { } from 'material-ui';

/**
# WEWorkflowJSON

@object
  @type class
  @extends React.Component
  @name WEWorkflowJSON
  @desc
*/

@radium
@mixin.decorate(DeveloperHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    model: PropTypes.object,
    style: PropTypes.any
  },

  defaultProps: {
    className: 'WorkflowJson',
    model: null,
    style: {}
  },

  contextTypes: {
    layout: PropTypes.any,
    editor: PropTypes.any
  }
})
export default class WEWorkflowJson extends Component {

  state = {
    model: this.props.model
  };

  componentWillMount() {}

  componentWillUnmount() {}

  componentDidUpdate() {
    this.refs.jsonEditor.setState({value: this.state.model});
  }

  render() {
    // let workflow = this.state.model;
    return <JsonEditor ref="jsonEditor" initialValue={this.props.model}/>;
  }

}
