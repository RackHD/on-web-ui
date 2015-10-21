// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorate from '../lib/decorate';
import mixin from '../lib/mixin';
import DeveloperHelpers from '../mixins/DeveloperHelpers';
/* eslint-enable no-unused-vars */

import {
    Checkbox,
    Snackbar
  } from 'material-ui';
import DataTable from './DataTable';
import DataTableToolbar from './DataTableToolbar';

@decorate({
  propTypes: {
    className: PropTypes.string,
    checkable: PropTypes.bool,
    emptyContent: PropTypes.any,
    headerContent: PropTypes.any,
    initialEntities: PropTypes.array,
    tableFields: PropTypes.array,
    toolbarContent: PropTypes.any,
    routeName: PropTypes.string,
    style: PropTypes.object,
    onSelectionChange: PropTypes.func
  },
  defaultProps: {
    className: '',
    checkable: true,
    emptyContent: 'No content.',
    headerContent: '',
    initialEntities: [],
    tableFields: [],
    toolbarContent: null,
    routeName: '',
    style: {},
    onSelectionChange: null
  }
})
@mixin(DeveloperHelpers)
export default class EntityGrid extends Component {

  state = {
    entities: this.props.initialEntities,
    error: null
  };

  selected = {};

  componentWillMount() { this.profileTime('EntityGrid', 'will-mount'); }

  componentDidMount() { this.profileTime('EntityGrid', 'did-mount'); }

  componentWillUnmount() { this.profileTime('EntityGrid', 'will-unmount'); }

  componentWillUpdate() { this.profileTime('EntityGrid', 'will-update'); }

  componentDidUpdate() {
    if (this.state.error) { this.refs.error.show(); }
    this.refs.table.update(this.state.entities);
    this.profileTime('EntityGrid', 'did-update');
  }

  update(entities) { this.setState({entities: entities}); }

  render() {
    var styles = this.props.style || {};
    styles.position = styles.position || 'relative';
    var tableFields = this.props.tableFields;
    if (this.props.checkable) {
      tableFields = tableFields.concat([{
        style: {width: 50},
        label: <Checkbox ref="cb-all" onCheck={this.checkAll.bind(this)} />,
        func: (data) => <Checkbox ref={'cb-' + data.id} onCheck={this.linkCheckbox.bind(this, data)} />
      }]);
    }
    return (
      <div
          className={'EntityGrid ' + this.props.className}
          style={styles}>
        <div
            style={{opacity: this.state.error ? '0.5' : '1.0'}}>
          <DataTableToolbar
              label={<a href={'#/' + this.props.routeName}>{this.props.headerContent}</a>}
              count={this.state.entities && this.state.entities.length || 0}>
            {this.props.toolbarContent}
          </DataTableToolbar>
          <DataTable
              ref="table"
              style={{width: '100%'}}
              fields={tableFields}
              initialData={this.state.entities}
              emptyContent={this.props.emptyContent}
              uniqueName={this.props.routeName} />
        </div>
        <Snackbar
          ref="error"
          action="dismiss"
          message={this.state.error || 'Unknown error.'}
          style={{position: 'absolute'}}
          onActionTouchTap={this.dismissError.bind(this)} />
      </div>
    );
  }

  showError(error) { this.setState({error: error.message || error}); }

  dismissError() {
    this.refs.error.dismiss();
    this.setState({error: null});
  }

  checkAll(event) {
    this.state.entities.forEach(data => {
      var checkbox = this.refs.table.refs['cb-' + data.id];
      if (checkbox) {
        checkbox.setChecked(event.target.checked);
        this.linkCheckbox(data, event);
      }
    });
    var cbAll = this.refs['cb-all'];
    if (cbAll) { cbAll.setChecked(event.target.checked); }
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(this.selected);
    }
  }

  linkCheckbox(item, event) {
    if (event.target.checked) { this.selected[item.id] = item; }
    else { delete this.selected[item.id]; }
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(this.selected);
    }
  }

}
