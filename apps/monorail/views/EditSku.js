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
    TextField,
    FlatButton,
    RaisedButton
  } from 'material-ui';
import JsonEditor from 'common-web-ui/views/JsonEditor';

import SkuStore from '../stores/SkuStore';
let skus = new SkuStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(EditorHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class EditSku extends Component {

  state = {
    sku: null,
    disabled: false
  };

  render() {
    if (!this.state.sku) {
      this.state.sku = this.props.skuRef || null;
    }
    var nameLink = this.linkObjectState('sku', 'name'),
        profileLink = this.linkObjectState('sku', 'profile');
    return (
      <div className="EditSku container">
        <div className="row">
          <div className="one-half column">
            <TextField valueLink={nameLink}
                       hintText="Name"
                       floatingLabelText="Name"
                       disabled={this.state.disabled} />
          </div>
          <div className="one-half column">
            <TextField valueLink={profileLink}
                       hintText="Profile"
                       floatingLabelText="Profile"
                       disabled={this.state.disabled} />
          </div>
        </div>

        <h3>JSON Editor</h3>
        <JsonEditor initialValue={this.state.sku}
                    updateParentState={this.updateStateFromJsonEditor.bind(this)}
                    disabled={this.state.disabled}
                    ref="jsonEditor" />
        <div className="buttons container">
          <FlatButton className="button"
                      label="Delete"
                      onClick={this.deleteSku.bind(this)}
                      disabled={this.state.disabled} />
          <FlatButton className="button"
                      label="Clone"
                      onClick={this.cloneSku.bind(this)}
                      disabled={true || this.state.disabled} />

          <div className="right">
            <FlatButton className="button"
                        label="Cancel"
                        onClick={this.routeBack}
                        disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Reset"
                          onClick={this.resetSku.bind(this)}
                          disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Save" primary={true}
                          onClick={this.saveSku.bind(this)}
                          disabled={this.state.disabled} />
          </div>
        </div>
      </div>
    );
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({sku: stateChange});
  }

  saveSku() {
    this.disable();
    skus.update(this.state.sku.id, this.state.sku).then(() => this.enable());
  }

  deleteSku() {
    var id = this.state.sku.id;
    this.disable();
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed && skus.destroy(id).then(() => this.routeBack()));
  }

  resetSku() {
    this.disable();
    skus.read(this.state.sku.id)
      .then(sku => this.setState({sku: sku, disabled: false}));
  }

  cloneSku() {}// TODO

}
