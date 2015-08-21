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

import FileStore from '../stores/FileStore';
let file = new FileStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(EditorHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class EditFile extends Component {

  state = {
    file: null,
    disabled: false
  };

  render() {
    if (!this.state.file) {
      this.state.file = this.props.fileRef || null;
    }
    var nameLink = this.linkObjectState('file', 'basename'),
        bodyLink = this.linkObjectState('file', 'body');
    return (
      <div className="EditFile ungrid">
        <div className="line">
          <div className="cell" style={{verticalAlign: 'top'}}>
            <TextField valueLink={nameLink}
                       hintText="Name"
                       floatingLabelText="Name"
                       disabled={this.state.disabled} />
            <br/>
            <label>Body:</label><br/>
            <textarea valueLink={bodyLink}
                      disabled={this.state.disabled}
                      rows={5}
                      cols={40}
                      style={{width: '99%', height: 300}} />
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
                          onClick={this.resetFile.bind(this)}
                          disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Save" primary={true}
                          onClick={this.saveFile.bind(this)}
                          disabled={this.state.disabled} />
          </div>
        </div>
      </div>
    );
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({file: stateChange});
  }

  saveFile() {
    this.disable();
    file.update(this.state.file.name, this.state.file.body).then(() => this.enable());
  }

  resetFile() {
    this.disable();
    file.read(this.state.file.name)
      .then(file => this.setState({file: file, disabled: false}));
  }

  cloneFile() {}// TODO

}
