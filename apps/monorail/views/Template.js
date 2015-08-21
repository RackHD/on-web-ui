'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditTemplate from './EditTemplate';
import CreateTemplate from './CreateTemplate';
export { CreateTemplate, EditTemplate };

import { LinearProgress } from 'material-ui';

import TemplateStore from '../stores/TemplateStore';
let templates = new TemplateStore();

@mixin.decorate(PageHelpers)
export default class Template extends Component {

  state = {
    template: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchTemplate = templates.watchOne(this.getTemplateId(), 'template', this);
    this.readTemplate();
  }

  componentWillUnmount() { this.unwatchTemplate(); }

  render() {
    return (
      <div className="Template">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'templates', label: 'Templates'},
          this.getTemplateId()
        )}
        {this.state.loading ? <LinearProgress mode="indeterminate"  /> : null}
        <EditTemplate templateRef={this.state.template} />
      </div>
    );
  }

  getTemplateId() { return this.props.params.templateId; }

  readTemplate() {
    this.setState({loading: true});
    templates.read(this.getTemplateId()).then(() => this.setState({loading: false}));
  }

}
