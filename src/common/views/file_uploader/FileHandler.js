// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import superagent from 'superagent';

import { LinearProgress, RaisedButton } from 'material-ui';

import FileStatus from './FileStatus';

const assign = Object.assign;

const defaultFileView = function (file, fileHandler) {
  let { fileRef, progress, status } = file,
      { props, state, upload } = fileHandler,
      { size } = fileRef,
      sizeUploaded = progress === 0 ? 0 : (100 / progress) * size;
  if (state.finished) {
    return null;
  }
  return (
    <div
        style={{
          opacity: status === FileStatus.UPLOADED ? 0 : 1,
          transition: 'opacity 5s ease-in-out'
        }}>
      <p style={{float: 'right'}}>
        {sizeUploaded} of {fileRef.size} bytes uploaded.</p>
      <h4 style={{color: status === FileStatus.FAILED ? 'red' : 'inherit'}}>
        {fileRef.name}</h4>
      <LinearProgress mode="determinate" value={progress} />
      {file.error &&
        <p style={{color: 'red'}}>{file.error}</p>}
      {!props.autoStart && status !== FileStatus.PENDING &&
        <RaisedButton label="Upload" onClick={upload} primary={true} />}
    </div>
  );
};

export default class FileHandler extends Component {
  static propTypes = {
    autoRemove: PropTypes.number,
    autoStart: PropTypes.bool,
    className: PropTypes.string,
    file: PropTypes.object.isRequired,
    fileView: PropTypes.func,
    method: PropTypes.string,
    onUploadEnd: PropTypes.func,
    onUploadProgress: PropTypes.func,
    onUploadStart: PropTypes.func,
    style: PropTypes.object,
    uploadHook: PropTypes.func,
    uploadUrl: PropTypes.string
  };

  static defaultProps = {
    autoRemove: 5000,
    autoStart: true,
    className: 'FileHandler',
    file: undefined,
    fileView: defaultFileView,
    onUploadEnd: () => {},
    onUploadProgress: () => {},
    onUploadStart: () => {},
    style: {},
    uploadHook: (fileHandler, sendFileUpload) => { sendFileUpload(); },
    uploadMethod: 'post',
    uploadUrl: null
  };

  state = {
    finished: false
  };

  componentDidMount() {
    let { autoStart, file } = this.props;
    if (file.status === FileStatus.PENDING && autoStart) {
      this.upload();
    }
  }

  upload = () => {
    const sendFileUpload = (uploadUrlOverride, formData) => {
      let {
        autoRemove,
        file,
        onUploadEnd,
        onUploadProgress,
        onUploadStart,
        uploadMethod,
        uploadUrl
      } = this.props;

      assign(file, { status: FileStatus.UPLOADING });
      onUploadStart(file, this);
      this.forceUpdate();

      if (!formData) {
        formData = new FormData();
        formData.append('file', file.fileRef);
      }

      let url = uploadUrlOverride || uploadUrl;
      if (!url) throw new Error('Invalid url for file upload.');

      superagent[uploadMethod](url)
        .accept('application/json')
        .send(formData)
        .on('progress', ({ percent }) => {
          assign(file, {progress: percent, status: FileStatus.UPLOADING});
          onUploadProgress(file, this);
          this.forceUpdate();
        })
        .end((err, res) => {
          assign(file, err ?
            {error: err, status: FileStatus.FAILED} :
            {result: res.body, status: FileStatus.UPLOADED});
          onUploadEnd(file, this);
          this.forceUpdate();
          if (autoRemove) {
            setTimeout(() => this.setState({finished: true}), autoRemove);
          }
        });
    };

    return this.props.uploadHook(this, sendFileUpload);
  };

  render() {
    let { children, className, file, fileView, style } = this.props;

    return (
      <div className={className} style={style}>
        {fileView(file, this)}
        {children}
      </div>
    );
  }
}
