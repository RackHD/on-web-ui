'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorateComponent from '../lib/decorateComponent';
import mixin from 'react-mixin';
import DeveloperHelpers from '../mixins/DeveloperHelpers';
/* eslint-enable no-unused-vars */

import {
    Checkbox,
    Snackbar
  } from 'material-ui';
import DataTable from './DataTable';
import DataTableToolbar from './DataTableToolbar';

@decorateComponent({
  propTypes: {
    className: PropTypes.string,
    emptyContent: PropTypes.any,
    headerContent: PropTypes.any,
    initialEntities: PropTypes.array,
    tableFields: PropTypes.array,
    toolbarContent: PropTypes.any,
    routeName: PropTypes.string,
    style: PropTypes.object
  },
  defaultProps: {
    className: '',
    emptyContent: 'No content.',
    headerContent: '',
    initialEntities: [],
    tableFields: [],
    toolbarContent: null,
    routeName: '',
    style: {}
  }
})
@mixin.decorate(DeveloperHelpers)
export default class EntityGrid extends Component {

  state = {
    entities: this.props.initialEntities,
    error: null
  };

  selected = {};

  componentWillMount() { this.profileTime('EntityGrid', 'will-mount'); }

  componentDidMount() { this.profileTime('EntityGrid', 'did-mount'); }

  componentWillUnmount() { this.profileTime('EntityGrid', 'will-unmount'); }

  componentDidUnmount() { this.profileTime('EntityGrid', 'did-unmount'); }

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
    var tableFields = this.props.tableFields.concat([{
      label: <Checkbox onCheck={this.checkAll.bind(this)} />,
      func: (data) => <Checkbox ref={'cb-' + data.id} onCheck={this.linkCheckbox.bind(this, data)} />
    }]);
    return (
      <div
          className={'EntityGrid ' + this.props.className}
          style={styles}>
        <div
            style={{opacity: this.state.error ? '0.5' : '1.0'}}>
          <DataTableToolbar
              style={{zIndex: 1}}
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
      if (checkbox) { checkbox.setChecked(event.target.checked); }
    });
  }

  linkCheckbox(item, event) {
    if (event.target.checked) { this.selected[item.id] = item; }
    else { delete this.selected[item.id]; }
  }

}
