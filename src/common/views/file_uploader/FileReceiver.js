// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import FileHandler from './FileHandler';
import FileStatus from './FileStatus';

export default class FileReceiver extends Component {
  static propTypes = {
    className: PropTypes.string,
    FileHandler: PropTypes.func,
    fileHandlerProps: PropTypes.object,
    onDragEnter: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDragOver: PropTypes.func,
    onFileDrop: PropTypes.func,
    style: PropTypes.object
  };

  static defaultProps = {
    className: '',
    FileHandler,
    fileHandlerProps: {},
    onDragEnter: () => {},
    onDragLeave: () => {},
    onDragOver: () => {},
    onFileDrop: () => {},
    style: {}
  };

  componentWillMount() {
    if (!window.FileReader) {
      console.error(new Error('Your browser does not support drag and drop.' +
        ' Please try again with an evergreen browser.'));
    }
  }

  componentDidMount() {
    let { openPanel, closePanel, onDragOver } = this.props;
    window.addEventListener('dragenter', this.onDragEnter);
    window.addEventListener('dragleave', this.onDragLeave);
    window.addEventListener('dragover', this.onDragOver);
    window.addEventListener('drop', this.onFileDrop);
  }

  componentWillUnmount() {
    let { openPanel, closePanel, onDragOver } = this.props;
    window.removeEventListener('dragenter', this.onDragEnter);
    window.removeEventListener('dragleave', this.onDragLeave);
    window.removeEventListener('dragover', this.onDragOver);
    window.removeEventListener('drop', this.onFileDrop);
  }

  onDragEnter = (event) => this.props.onDragEnter(event, this);

  onDragLeave = (event) => {
    event.preventDefault();
    return this.props.onDragLeave(event, this);
  };

  onDragOver = (event) => {
    event.preventDefault();
    return this.props.onDragOver(event, this);
  };

  onFileDrop = (event) => {
    event.preventDefault();

    let fileList = event.dataTransfer.files,
        files = [];

    for (let i = 0; i < fileList.length; i += 1) {
      files.push({
        fileRef: fileList[i],
        id: Date.now().toString(32) + Math.round(Math.random() * 1000000).toString(32),
        progress: 0,
        status: FileStatus.PENDING
      });
    }

    this.setState({ files }, () => {
      this.props.onFileDrop(event, this, files);
    });
  };

  state = {
    files: []
  };

  render() {
    let { children, className, FileHandler, fileHandlerProps, style } = this.props;

    let files = (
      <div className="files">
        {this.state.files.map(file => (
          <FileHandler key={file.id} file={file} {...fileHandlerProps} />
        ))}
      </div>
    );

    return (
      <div className={className} style={style}>
        {children}
        {files}
      </div>
    );
  }
}
