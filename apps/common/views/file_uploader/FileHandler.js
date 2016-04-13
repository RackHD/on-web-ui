'use strict';

import React, { Component, PropTypes } from 'react';
import superagent from 'superagent';

import mixin from '../../lib/mixin';
import FileStatus from './FileStatus';

const defaultFileView = function (file, fileHandler) {
  let { fileRef } = file;
  return (
    <dl>
      <dh>{ fileRef.name }</dh>
      <dd>
        <p>{ file.id }</p>
        <p>{ fileRef.type }</p>
        <p>{ fileRef.size / 1000 / 1000 } MB</p>
        <p>{ file.progress }%</p>
        <p>{ FileStatus[file.status] }</p>
        <p>
          <button onClick={fileHandler.upload}>Upload</button>
        </p>
      </dd>
    </dl>
  );
};

export default class FileHandler extends Component {
  static propTypes = {
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
    autoStart: false,
    className: 'FileHandler',
    file: undefined,
    fileView: defaultFileView,
    onUploadEnd: function () {},
    onUploadProgress: function () {},
    onUploadStart: function () {},
    style: {},
    uploadHook: function (fileHandler, sendFileUpload) { sendFileUpload(); },
    uploadMethod: 'post',
    uploadUrl: null,
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
        file,
        onUploadEnd,
        onUploadProgress,
        onUploadStart,
        uploadMethod,
        uploadUrl
      } = this.props;

      onUploadStart(
        mixin(file, { status: FileStatus.UPLOADING }),
        this);

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
          onUploadProgress(
            mixin(file, { progress: percent, status: FileStatus.UPLOADING }),
            this);
        })
        .end((err, res) => {
          if (err) {
            onUploadEnd(
              mixin(file, { error: err, status: FileStatus.FAILED }),
              this);
          }
          else {
            onUploadEnd(
              mixin(file, { result: res.body, status: FileStatus.UPLOADED }),
              this);
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
