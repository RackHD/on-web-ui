// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import EditorHelpers from 'common-web-ui/mixins/EditorHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import TemplateStore from '../stores/TemplateStore';
let templates = new TemplateStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(EditorHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class EditTemplate extends Component {

  state = {
    template: this.props.template,
    disabled: !this.props.template,
    loading: !this.props.loading
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.template) this.setState({template: nextProps.template, loading: false, disabled: false});
  }

  render() {
    var template = this.state.template || {},
        nameLink = this.linkObjectState('template', 'name'),
        contentsLink = this.linkObjectState('template', 'contents');
    return (
      <div className="EditTemplate">
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text={template.id ? 'Edit File' : 'Create File'} />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <RaisedButton
                label="Cancel"
                onClick={this.routeBack}
                disabled={this.state.disabled} />
            <RaisedButton
                label="Save"
                primary={true}
                onClick={this.saveTemplate.bind(this)}
                disabled={this.state.disabled} />
          </ToolbarGroup>
        </Toolbar>
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix" />}
        <div style={{padding: '0 10px 10px'}}>
          <TextField
              valueLink={nameLink}
              hintText="Name"
              floatingLabelText="Name"
              disabled={this.state.disabled}
              fullWidth={true} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Template Content:</h5>
          <textarea
              valueLink={contentsLink}
              disabled={this.state.disabled}
              rows={5}
              cols={40}
              style={{width: '99%', height: 300}} />
        </div>
      </div>
    );
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({template: stateChange});
  }

  saveTemplate() {
    this.setState({loading: true});
    this.disable();
    let isNewTemplate = !this.state.template.id;
    templates.update(this.state.template.name, this.state.template.contents).then(() => {
      this.enable()
      this.setState({loading: false});
      if (isNewTemplate) this.routeBack();
    });
  }

}
