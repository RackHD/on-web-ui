// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    LinearProgress
  } from 'material-ui';

import VersionStore from '../stores/VersionStore';
let versions = new VersionStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class VersionsGrid extends Component {

  state = {
    versions: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchVersions = versions.watchAll('versions', this);
    this.listVersions();
  }

  componentWillUnmount() { this.unwatchVersions(); }

  render() {
    return (
      <div className="VersionsGrid">
        {this.renderGridToolbar({
          label: <a href="#/versions">Versions</a>,
          count: this.state.versions && this.state.versions.length || 0
        })}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
        {
          this.renderGrid({
            results: this.state.versions,
            resultsPerPage: this.props.size || 50
          }, version => (
            {
              Package: version.package,
              Version: version.version
            }
          ), 'No versions.')
        }
      </div>
    );
  }

  listVersions() {
    this.setState({loading: true});
    versions.list().then(() => this.setState({loading: false}));
  }

}
