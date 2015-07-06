'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';

import {
  } from 'material-ui';

import JsonEditor from 'common-web-ui/views/JsonEditor';

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
    editor: PropTypes.object,
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
    editor: null,
    style: {}
  }
})
export default class WEWorkflowJSON extends Component {

  state = {
    disabled: false,
    json: ''
  };

  componentWillMount() {
    this.setState({
      json: this.props.editor.graph.json
    });
  }

  componentWillUnmount() {}

  render() {
    return (
      <JsonEditor
          initialValue={this.state.json}
          updateParentState={this.updateStateFromJsonEditor.bind(this)}
          disabled={this.state.disabled}
          ref="root" />
    );
  }

  updateStateFromJsonEditor(json) {
    this.setState({ json });
  }

}
