// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import { LinearProgress } from 'material-ui';

import ResourceTable from 'common-web-ui/views/ResourceTable';

import VersionStore from '../../stores/VersionStore';

@mixin(FormatHelpers, RouteHelpers)
export default class VersionsGrid extends Component {

  versions = new VersionStore();

  state = {
    versions: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchVersions = this.versions.watchAll('versions', this);
    this.listVersions();
  }

  componentWillUnmount() { this.unwatchVersions(); }

  render() {
    return (
      <ResourceTable
          initialEntities={this.state.versions}
          routeName="versions"
          emptyContent="No versions."
          headerContent="Versions"
          loadingContent={this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
          mapper={version => (
            {
              Package: version.package,
              Version: version.version
            }
          )} />
    );
  }

  listVersions() {
    this.setState({loading: true});
    this.versions.list().then(() => this.setState({loading: false}));
  }

}
