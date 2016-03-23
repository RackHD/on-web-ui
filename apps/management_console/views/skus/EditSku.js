// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

import mixin from 'rui-common/lib/mixin';
import EditorHelpers from 'rui-common/mixins/EditorHelpers';

import {
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonEditor from 'rui-common/views/JsonEditor';

import SkuStore from 'rui-common/stores/SkuStore';

@mixin(EditorHelpers)
export default class EditSku extends Component {

  static contextTypes = {router: PropTypes.any};

  skus = new SkuStore();

  state = {
    sku: this.props.sku,
    disabled: !this.props.sku,
    loading: !this.props.sku
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.sku) this.setState({sku: nextProps.sku, loading: false, disabled: false});
  }

  render() {
    var sku = this.state.sku || {},
        nameLink = this.linkObjectState('sku', 'name');
    return (
      <div className="EditSku">
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text={sku.id ? 'Edit SKU' : 'Create SKU'} />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
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
          <TextField valueLink={nameLink}
              hintText="Name"
              floatingLabelText="Name"
              disabled={this.state.disabled}
              fullWidth={true} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>SKU JSON:</h5>
          <JsonEditor
              initialValue={this.state.sku}
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

}
