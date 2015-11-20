// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
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

import JsonEditor from 'common-web-ui/views/JsonEditor';

import SkuStore from '../stores/SkuStore';
let skus = new SkuStore();

@mixin(DialogHelpers)
@mixin(FormatHelpers)
@mixin(EditorHelpers)
@mixin(RouteHelpers)
@mixin(GridHelpers)
export default class EditSku extends Component {

  state = {
    sku: null,
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
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix" />}
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
      skus.update(this.state.sku.id, this.state.sku).then(() => this.enable());
    }
    else {
      skus.create(this.state.sku).then(() => this.routeBack());
    }
  }

  // resetSku() {
  //   this.disable();
  //   skus.read(this.state.sku.id)
  //     .then(sku => this.setState({sku: sku, disabled: false}));
  // }

}
