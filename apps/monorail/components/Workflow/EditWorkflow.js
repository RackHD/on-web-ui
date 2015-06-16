'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import EditorHelpers from 'common-web-ui/mixins/EditorHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    TextField,
    FlatButton,
    RaisedButton
  } from 'material-ui';
import { workflows } from '../../actions/WorkflowActions';
import JsonEditor from 'common-web-ui/components/JsonEditor';

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(EditorHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class EditWorkflow extends Component {

  state = {
    workflow: null,
    disabled: false
  };

  render() {
    if (!this.state.workflow) {
      this.state.workflow = this.props.workflowRef || null;
    }
    var friendlyNameLink = this.linkObjectState('workflow', 'friendlyName'),
        injectableNameLink = this.linkObjectState('workflow', 'injectableName');
    return (
      <div className="EditWorkflow container">
        <div className="row">
          <div className="one-half column">
            <TextField valueLink={friendlyNameLink}
                       hintText="Friendly Name"
                       floatingLabelText="Friendly Name"
                       disabled={this.state.disabled} />
          </div>
          <div className="one-half column">
            <TextField valueLink={injectableNameLink}
                       hintText="Injectable Name"
                       floatingLabelText="Injectable Name"
                       disabled={this.state.disabled} />
          </div>
        </div>

        <h3>JSON Editor</h3>
        <JsonEditor initialValue={this.state.workflow}
                    updateParentState={this.updateStateFromJsonEditor.bind(this)}
                    disabled={this.state.disabled}
                    ref="jsonEditor" />
        <div className="buttons container">
          <FlatButton className="button"
                      label="Delete"
                      onClick={this.deleteWorkflow.bind(this)}
                      disabled={true || this.state.disabled} />
          <FlatButton className="button"
                      label="Clone"
                      onClick={this.cloneWorkflow.bind(this)}
                      disabled={true || this.state.disabled} />

          <div className="right">
            <FlatButton className="button"
                        label="Cancel"
                        onClick={this.routeBack}
                        disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Reset"
                          onClick={this.resetWorkflow.bind(this)}
                          disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Save" primary={true}
                          onClick={this.saveWorkflow.bind(this)}
                          disabled={true || this.state.disabled} />
          </div>
        </div>
      </div>
    );
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({workflow: stateChange});
  }

  saveWorkflow() {
    this.disable();
    workflows.update(this.state.node.id, this.state.node).then(() => this.enable());
  }

  deleteWorkflow() {
    var id = this.state.node.id;
    this.disable();
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed && workflows.destroy(id).then(() => this.routeBack()));
  }

  resetWorkflow() {
    this.disable();
    workflows.read(this.state.node.id)
      .then(node => this.setState({node: node, disabled: false}));
  }

  cloneWorkflow() {}// TODO

}
