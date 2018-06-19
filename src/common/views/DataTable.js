// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import {
    Table,
    TableHeader,
    TableRow,
    TableHeaderColumn,
    TableBody,
    TableRowColumn
  } from 'material-ui';

export default class DataTable extends Component {

  static propTypes = {
    body: PropTypes.object,
    className: PropTypes.string,
    dataKey: PropTypes.string,
    emptyContent: PropTypes.string,
    fields: PropTypes.array,
    header: PropTypes.object,
    initialData: PropTypes.array,
    style: PropTypes.object,
    table: PropTypes.object,
    uniqueName: PropTypes.string
  };

  static defaultProps = {
    body: {},
    className: '',
    dataKey: 'id',
    emptyContent: 'No data.',
    fields: null,
    header: {},
    initialData: null,
    style: {},
    table: {},
    uniqueName: ''
  };

  state = {data: this.props.initialData};

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialData) this.update(nextProps.initialData);
  }

  update(data) {
    this.setState({ data });
  }

  render() {
    let data = this.state.data;

    if (!data || !data.length) {
      return (
        <div className={'empty center' + this.props.className} style={this.props.style}>
          {this.props.emptyContent}
        </div>
      );
    }

    let fields = this.props.fields ||
      Object.keys(data[0]).map(fieldName => ({name: fieldName}));

    let tableFields = fields.map(field => {
      return <TableHeaderColumn key={field.name + '-field'}>{field.name}</TableHeaderColumn>;
    });

    let tableRows = data.map((item, i) => {
      return (
        <TableRow key={i}>
          {fields.map(field => {
            return (
              <TableRowColumn key={field.name + '-row'} style={{whiteSpace: 'default'}}>
                {item[field.name]}
              </TableRowColumn>
            );
          })}
        </TableRow>
      );
    });

    return (
      <Table className={this.props.className} style={this.props.style} {...this.props.table}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false} {...this.props.header}>
          <TableRow>{tableFields}</TableRow>
        </TableHeader>
        <TableBody stripedRows={true} displayRowCheckbox={false} {...this.props.body}>
          {tableRows}
        </TableBody>
      </Table>
    );
  }

}
