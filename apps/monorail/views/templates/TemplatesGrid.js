// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import { RaisedButton, LinearProgress } from 'material-ui';

import ResourceTable from 'common-web-ui/views/ResourceTable';

import TemplateStore from '../../stores/TemplateStore';

@mixin(FormatHelpers, RouteHelpers)
export default class TemplatesGrid extends Component {

  templates = new TemplateStore();

  state = {
    templates: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchTemplates = this.templates.watchAll('templates', this);
    this.listTemplates();
  }

  componentWillUnmount() { this.unwatchTemplates(); }

  render() {
    return (
      <ResourceTable
          initialEntities={this.state.pollers}
          routeName="templates"
          emptyContent="No templates."
          headerContent="Templates"
          loadingContent={this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
          toolbarContent={<RaisedButton label="Create Template" primary={true} onClick={this.createTemplate.bind(this)} />}
          mapper={template => (
            {
              ID: <a href={this.routePath('templates', template.name)}>{this.shortId(template.id)}</a>,
              Name: template.name,
              Created: this.fromNow(template.createdAt),
              Updated: this.fromNow(template.updatedAt)
            }
          )} />
    );
  }

  listTemplates() {
    this.setState({loading: true});
    this.templates.list().then(() => this.setState({loading: false}));
  }

  createTemplate() { this.routeTo('templates', 'new'); }

}
