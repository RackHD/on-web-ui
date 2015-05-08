'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from '../mixins/DialogHelpers';
import FormatHelpers from '../mixins/FormatHelpers';
import EditorHelpers from '../mixins/EditorHelpers';
import RouteHelpers from '../mixins/RouteHelpers';
import GridHelpers from '../mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    TextField,
    FlatButton,
    RaisedButton
  } from 'material-ui';
import WorkflowAPI from '../../api/WorkflowAPI';
import JsonEditor from '../JsonEditor';

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
    // TODO: figure out how to save a workflow template.
    throw new Error('Cannot save workflow templates.');
  }

  deleteWorkflow() {
    // TODO: get API to support deleting workflows
    throw new Error('Cannot delete workflow templates.');
  }

  resetWorkflow() {
    this.disable();
    WorkflowAPI.getWorkflow(this.state.workflow.id)
      .then(workflow => {
        this.setState({workflow: workflow});
        this.enable();
      })
      .catch(err => console.error(err));
  }

  cloneWorkflow() {}// TODO

}
