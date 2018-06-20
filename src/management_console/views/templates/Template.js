// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';

import mixin from 'src-common/lib/mixin';
import FormatHelpers from 'src-common/lib/FormatHelpers';

import EditTemplate from './EditTemplate';
import CreateTemplate from './CreateTemplate';
export { CreateTemplate, EditTemplate };

import {
    LinearProgress,
    List, ListItem,
    RaisedButton,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import TemplateStore from 'src-common/stores/TemplateStore';

export default class Template extends Component {

  templates = new TemplateStore();

  state = {
    template: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchTemplate = this.templates.watchOne(this.getTemplateId(), 'template', this);
    this.readTemplate();
  }

  componentWillUnmount() { this.unwatchTemplate(); }

  render() {
    let template = this.state.template || {};
    return (
      <div className="Template">
        <LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />
        <Toolbar>
          <ToolbarGroup key={0} firstChild={true}>
            <ToolbarTitle text="Template Details" />
          </ToolbarGroup>
          <ToolbarGroup key={1} lastChild={true}>
          </ToolbarGroup>
        </Toolbar>
        <div className="ungrid collapse">
          <div className="line">
            <div className="cell">
              <List>
                <ListItem
                  primaryText={FormatHelpers.fromNow(template.updatedAt)}
                  secondaryText="Updated" />
              </List>
            </div>
            <div className="cell">
              <List>
                <ListItem
                  primaryText={FormatHelpers.fromNow(template.createdAt)}
                  secondaryText="Created" />
              </List>
            </div>
          </div>
        </div>
        <EditTemplate template={this.state.template} />
      </div>
    );
  }

  getTemplateId() {
    return this.state.template && this.state.template.id ||
    this.props.templateId || this.props.params.templateId;
  }

  readTemplate() {
    this.setState({loading: true});
    this.templates.read(this.getTemplateId()).then(() => this.setState({loading: false}));
  }

}
