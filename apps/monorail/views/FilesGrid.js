// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import { RaisedButton, LinearProgress } from 'material-ui';

import ResourceTable from 'common-web-ui/views/ResourceTable';

import FileStore from '../stores/FileStore';

@mixin(FormatHelpers, RouteHelpers)
export default class FilesGrid extends Component {

  files = new FileStore();

  state = {
    files: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchFiles = this.files.watchAll('files', this);
    this.listFiles();
  }

  componentWillUnmount() { this.unwatchFiles(); }

  render() {
    return (
      <ResourceTable
          initialEntities={this.state.files}
          routeName="files"
          emptyContent="No files."
          headerContent="Files"
          loadingContent={this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
          toolbarContent={<RaisedButton label="Create File" primary={true} onClick={this.createNode.bind(this)} />}
          mapper={file => (
            {
              ID: <a href={this.routePath('files', file.uuid)}>{this.shortId(file.uuid)}</a>,
              Name: file.basename,
              MD5: file.md5,
              Version: file.version
            }
          )} />
    );
  }

  listFiles() {
    this.setState({loading: true});
    this.files.list().then(() => this.setState({loading: false}));
  }

  createNode() { this.routeTo('files', 'new'); }

}
