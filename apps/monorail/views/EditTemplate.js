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
import JsonEditor from 'common-web-ui/views/JsonEditor';

import TemplateStore from '../stores/TemplateStore';
let templates = new TemplateStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(EditorHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class EditTemplate extends Component {

  state = {
    template: null,
    disabled: false
  };

  render() {
    if (!this.state.template) {
      this.state.template = this.props.templateRef || null;
    }
    var nameLink = this.linkObjectState('template', 'name'),
        contentsLink = this.linkObjectState('template', 'contents');
    return (
      <div className="EditTemplate ungrid">
        <div className="line">
          <div className="cell" style={{verticalAlign: 'top'}}>
            <TextField valueLink={nameLink}
                       hintText="Name"
                       floatingLabelText="Name"
                       disabled={this.state.disabled} />
            <br/>
            <label>Content:</label><br/>
            <textarea valueLink={contentsLink}
                      disabled={this.state.disabled}
                      rows={5}
                      cols={40}
                      style={{width: '99%', height: 300}} />
          </div>
          <div className="cell">
            <h3>Raw JSON</h3>
            <JsonEditor initialValue={this.state.template}
                        updateParentState={this.updateStateFromJsonEditor.bind(this)}
                        disabled={this.state.disabled}
                        ref="jsonEditor" />
          </div>
        </div>

        <div className="buttons container">
          <div className="right">
            <FlatButton className="button"
                        label="Cancel"
                        onClick={this.routeBack}
                        disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Reset"
                          onClick={this.resetTemplate.bind(this)}
                          disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Save" primary={true}
                          onClick={this.saveTemplate.bind(this)}
                          disabled={this.state.disabled} />
          </div>
        </div>
      </div>
    );
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({template: stateChange});
  }

  saveTemplate() {
    this.disable();
    templates.update(this.state.template.name, this.state.template.contents).then(() => this.enable());
  }

  resetTemplate() {
    this.disable();
    templates.read(this.state.template.name)
      .then(template => this.setState({template: template, disabled: false}));
  }

  cloneTemplate() {}// TODO

}
