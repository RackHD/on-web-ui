// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import {
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import TemplateStore from 'src-common/stores/TemplateStore';

export default class EditTemplate extends Component {

  static contextTypes = {router: PropTypes.any};

  templates = new TemplateStore();

  state = {
    template: this.props.template,
    disabled: !this.props.template,
    loading: !this.props.loading
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.template) this.setState({template: nextProps.template, loading: false, disabled: false});
  }

  render() {
    let template = this.state.template || {};
    return (
      <div className="EditTemplate">
        <Toolbar>
          <ToolbarGroup key={0} firstChild={true}>
            <ToolbarTitle text={template.id ? 'Edit File' : 'Create File'} />
          </ToolbarGroup>
          <ToolbarGroup key={1} lastChild={true}>
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
        <LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />
        <div style={{padding: '0 10px 10px'}}>
          <TextField
              hintText="Name"
              floatingLabelText="Name"
              disabled={this.state.disabled}
              value={template.name}
              onChange={e => {
                template.name = e.target.value;
                this.setState({ template });
              }}
              fullWidth={true} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Template Content:</h5>
          <textarea
              disabled={this.state.disabled}
              rows={5}
              cols={40}
              value={template.contents}
              onChange={e => {
                template.contents = e.target.value;
                this.setState({ template });
              }}
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
    this.templates.update(this.state.template.name, this.state.template.contents).then(() => {
      this.enable();
      this.setState({loading: false});
      if (isNewTemplate) this.context.router.goBack();
    });
  }

  disable() { this.setState({disabled: true}); }

  enable() {
    setTimeout(() => this.setState({disabled: false}), 500);
  }

}
