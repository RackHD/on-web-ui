// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import mixin from 'src-common/lib/mixin';

import {
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonEditor from 'src-common/views/JsonEditor';

import SkuStore from 'src-common/stores/SkuStore';

export default class EditSku extends Component {

  static contextTypes = {router: PropTypes.any};

  skus = new SkuStore();

  state = {
    sku: this.props.sku,
    disabled: !this.props.sku,
    loading: !this.props.sku
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.sku) {
      this.setState({sku: nextProps.sku, loading: false, disabled: false});
    }
  }

  render() {
    let sku = this.state.sku || {};
    return (
      <div className="EditSku">
        <Toolbar>
          <ToolbarGroup key={0} firstChild={true}>
            <ToolbarTitle text={sku.id ? 'Edit SKU' : 'Create SKU'} />
          </ToolbarGroup>
          <ToolbarGroup key={1} lastChild={true}>
            <RaisedButton
                label="Cancel"
                onClick={this.routeBack}
                disabled={this.state.disabled} />
            <RaisedButton
                label="Save"
                primary={true}
                onClick={this.saveSku.bind(this)}
                disabled={this.state.disabled} />
          </ToolbarGroup>
        </Toolbar>
        <LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />
        <div style={{padding: '0 10px 10px'}}>
          <TextField
              hintText="Name"
              floatingLabelText="Name"
              disabled={this.state.disabled}
              value={sku.name}
              onChange={e => {
                sku.name = e.target.value;
                this.setState({ sku });
              }}
              fullWidth={true} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>SKU JSON:</h5>
          <JsonEditor
              value={this.state.sku}
              updateParentState={this.updateStateFromJsonEditor.bind(this)}
              disabled={this.state.disabled}
              ref="jsonEditor" />
        </div>
      </div>
    );
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({sku: stateChange});
  }

  saveSku() {
    this.disable();
    if (this.state.sku.id) {
      this.skus.update(this.state.sku.id, this.state.sku).then(() => this.enable());
    }
    else {
      this.skus.create(this.state.sku).then(() => this.context.router.goBack());
    }
  }

  disable() { this.setState({disabled: true}); }

  enable() {
    setTimeout(() => this.setState({disabled: false}), 500);
  }

}
