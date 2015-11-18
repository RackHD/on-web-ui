// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';

import EditTemplate from './EditTemplate';
import CreateTemplate from './CreateTemplate';
export { CreateTemplate, EditTemplate };

import {
    LinearProgress,
    List, ListItem,
    RaisedButton,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle,
    Snackbar
  } from 'material-ui';

import TemplateStore from '../stores/TemplateStore';
let templates = new TemplateStore();

@mixin(DialogHelpers, FormatHelpers)
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
    let template = this.state.template || {};
    return (
      <div className="Template">
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text="Template Details" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
          </ToolbarGroup>
        </Toolbar>
        <div className="ungrid">
          <div className="line">
            <div className="cell">
              <List>
                <ListItem
                  primaryText={this.fromNow(template.updatedAt)}
                  secondaryText="Updated" />
              </List>
            </div>
            <div className="cell">
              <List>
                <ListItem
                  primaryText={this.fromNow(template.createdAt)}
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
    templates.read(this.getTemplateId()).then(() => this.setState({loading: false}));
  }

}
