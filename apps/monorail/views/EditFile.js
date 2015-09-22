// Copyright 2015, EMC, Inc.

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
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import FileStore from '../stores/FileStore';
let file = new FileStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(EditorHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class EditFile extends Component {

  state = {
    file: this.props.file,
    disabled: !this.props.file,
    loading: !this.props.file
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.file) this.setState({file: nextProps.file, loading: false, disabled: false});
  }

  render() {
    let file = this.state.file || {},
        nameLink = this.linkObjectState('file', 'basename'),
        bodyLink = this.linkObjectState('file', 'body');
    return (
      <div className="EditFile">
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text={file.uuid ? 'Edit File' : 'Create File'} />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <RaisedButton
                label="Cancel"
                onClick={this.routeBack}
                disabled={this.state.disabled} />
            <RaisedButton
                label="Save"
                primary={true}
                onClick={this.saveFile.bind(this)}
                disabled={this.state.disabled} />
          </ToolbarGroup>
        </Toolbar>
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix" />}
        <div style={{padding: '0 10px 10px'}}>
          <TextField
              valueLink={nameLink}
              hintText="Name"
              floatingLabelText="Name"
              disabled={this.state.disabled}
              fullWidth={true} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>File Content:</h5>
          <textarea
              valueLink={bodyLink}
              disabled={this.state.disabled}
              rows={5}
              cols={40}
              style={{boxSizing: 'border-box', width: '100%', height: 300}} />
        </div>
      </div>
    );
  }

  saveFile() {
    this.setState({loading: true});
    this.disable();
    let isNewFile = !this.state.file.uuid;
    file.update(this.state.file.basename, this.state.file.body).then(() => {
      this.enable()
      this.setState({loading: false});
      if (isNewFile) this.routeBack();
    });
  }

}
