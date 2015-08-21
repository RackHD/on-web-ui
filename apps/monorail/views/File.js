'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import { LinearProgress } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import FileStore from '../stores/FileStore';
let file = new FileStore();

@mixin.decorate(PageHelpers)
export default class File extends Component {

  state = {
    file: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchFile = file.watchOne(this.getFileId(), 'file', this);
    this.readFile();
  }

  componentWillUnmount() { this.unwatchFile(); }

  render() {
    return (
      <div className="File">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'obms', label: 'OBM Services'},
          this.props.params.obmsId
        )}
        {this.state.loading ? <LinearProgress mode="indeterminate"  /> : null}
        <JsonInspector
            search={false}
            isExpanded={() => true}
            data={this.state.file || {}} />
      </div>
    );
  }

  getFileId() { return this.props.fileId || this.props.params.fileId; }

  readFile() {
    this.setState({loading: true});
    file.read(this.getFileId()).then(() => this.setState({loading: false}));
  }

}
