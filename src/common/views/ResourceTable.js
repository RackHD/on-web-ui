// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Checkbox, FontIcon } from 'material-ui';

import DataTable from './DataTable';
import DataTableToolbar from './DataTableToolbar';

export default class ResourceTable extends Component {

  static propTypes = {
    className: PropTypes.string,
    emptyContent: PropTypes.any,
    filter: PropTypes.func,
    headerContent: PropTypes.any,
    initialEntities: PropTypes.array,
    limit: PropTypes.number,
    loadingContent: PropTypes.any,
    mapper: PropTypes.func,
    routeName: PropTypes.string,
    sort: PropTypes.func,
    style: PropTypes.object,
    table: PropTypes.object,
    toolbarContent: PropTypes.any
  };

  static defaultProps = {
    className: '',
    emptyContent: 'No content.',
    filter: null,
    headerContent: '',
    initialEntities: [],
    limit: null,
    loadingContent: null,
    mapper: null,
    routeName: '',
    sort: null,
    style: {},
    table: {},
    toolbarContent: null
  };

  static contextTypes = {
    icons: PropTypes.any,
    muiTheme: PropTypes.any
  };

  state = {
    entities: this.props.initialEntities
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialEntities) this.update(nextProps.initialEntities);
  }

  update(entities) {
    this.setState({ entities });
  }

  render() {
    let data = this.state.entities;

    if (data && data.length) {
      if (typeof this.props.filter === 'function') {
        data = data.filter(this.props.filter);
      }

      if (data.length) {
        if (typeof this.props.sort === 'function') {
          data = data.sort(this.props.sort);
        }

        if (this.props.limit && data.length > this.props.limit) {
          data.length = this.props.limit;
        }

        if (this.props.mapper) {
          data = data.map(this.props.mapper);
        }
      }
    }

    let emcTheme = this.context.muiTheme,
        icons = this.context.icons,
        icon = icons && icons[this.props.routeName];

    if (icon) {
      icon = <FontIcon className={icon}
          color={emcTheme.rawTheme.palette.textColor}
          hoverColor={null} />;
    }

    return (
      <div
          className={'ResourceTable ' + this.props.className}
          style={this.props.style}>
        <DataTableToolbar
            icon={icon}
            label={<Link to={'/mc/' + this.props.routeName}>{this.props.headerContent}</Link>}
            count={data && data.length || 0}>
          {this.props.toolbarContent}
        </DataTableToolbar>
        {this.props.loadingContent}
        <DataTable
            ref="table"
            style={{width: '100%'}}
            initialData={data}
            emptyContent={this.props.emptyContent}
            uniqueName={this.props.routeName}
            {...this.props.table} />
      </div>
    );
  }

}
