'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';

import {
    Dialog
  } from 'material-ui';

import WETWorkflowsLibrary from '../WorkflowsLibrary';

/**
# WELoadWorkflowDialog

@object
  @type class
  @extends React.Component
  @name WELoadWorkflowDialog
  @desc
*/

@radium
@mixin.decorate(DeveloperHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
    style: {}
  }
})
export default class WELoadWorkflowDialog extends Component {

  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let standardActions = [
      { text: 'Cancel' },
      { text: 'Submit', onTouchTap: this._onDialogSubmit, ref: 'submit' }
    ];

    return (
      <Dialog
        ref="root"
        title="Dialog With Standard Actions"
        actions={standardActions}
        actionFocus="submit"
        modal={this.state.modal}>
        <WETWorkflowsLibrary ref="workflowsLibrary" editor={this.props.editor} />
      </Dialog>
    );
  }

  show() {
    this.refs.root.show();
  }

}
