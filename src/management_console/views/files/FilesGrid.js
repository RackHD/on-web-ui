// Copyright 2015, EMC, Inc.

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { RaisedButton, LinearProgress } from 'material-ui';

import FormatHelpers from 'src-common/lib/FormatHelpers';
import ResourceTable from 'src-common/views/ResourceTable';
import FileStore from 'src-common/stores/FileStore';

export default class FilesGrid extends Component {

  static contextTypes = {router: PropTypes.any};

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
          loadingContent={<LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />}
          toolbarContent={<RaisedButton label="Create File" primary={true} onClick={this.createNode.bind(this)} />}
          mapper={file => (
            {
              ID: <Link to={'/mc/files/' + file.uuid}>{FormatHelpers.shortId(file.uuid)}</Link>,
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

  createNode() {
    this.context.router.push('/mc/files/new');
  }

}
