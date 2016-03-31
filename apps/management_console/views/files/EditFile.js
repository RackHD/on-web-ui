// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

import mixin from 'rui-common/lib/mixin';
import EditorHelpers from 'rui-common/mixins/EditorHelpers';

import {
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import FileStore from 'rui-common/stores/FileStore';

@mixin(EditorHelpers)
export default class EditFile extends Component {

  static contextTypes = {router: PropTypes.any};

  files = new FileStore();

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
        <LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />
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
    this.files.update(this.state.file.basename, this.state.file.body).then(() => {
      this.enable()
      this.setState({loading: false});
      if (isNewFile) this.context.router.goBack();
    });
  }

}
