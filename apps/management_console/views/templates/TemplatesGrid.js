// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { RaisedButton, LinearProgress } from 'material-ui';

import FormatHelpers from 'rui-common/mixins/FormatHelpers';
import ResourceTable from 'rui-common/views/ResourceTable';
import TemplateStore from 'rui-common/stores/TemplateStore';

export default class TemplatesGrid extends Component {

  static contextTypes = {router: PropTypes.any};

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
          initialEntities={this.state.templates}
          routeName="templates"
          emptyContent="No templates."
          headerContent="Templates"
          loadingContent={this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
          toolbarContent={<RaisedButton label="Create Template" primary={true} onClick={this.createTemplate.bind(this)} />}
          mapper={template => (
            {
              ID: <Link to={'/mc/templates/' + template.name}>{FormatHelpers.shortId(template.id)}</Link>,
              Name: template.name,
              Created: FormatHelpers.fromNow(template.createdAt),
              Updated: FormatHelpers.fromNow(template.updatedAt)
            }
          )} />
    );
  }

  listTemplates() {
    this.setState({loading: true});
    this.templates.list().then(() => this.setState({loading: false}));
  }

  createTemplate() {
    this.context.router.push('/mc/templates/new');
  }

}
