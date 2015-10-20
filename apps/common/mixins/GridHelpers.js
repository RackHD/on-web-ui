// Copyright 2015, EMC, Inc.

'use strict';

import React from 'react';

import {
    Table,
    TableHeader,
    TableRow,
    TableHeaderColumn,
    TableBody,
    TableRowColumn,
    Toolbar,
    ToolbarGroup
  } from 'material-ui';

export default {

  renderGridToolbar(params) {
    if (!params || !params.label) {
      return 'Unabled to render grid toolbar.';
    }
    if (params.count || params.count === 0) {
      params.count = <span>({params.count})</span>;
    }
    var rightToolbar = null;
    if (params.right) {
      rightToolbar = (
        <ToolbarGroup key={1} float="right">
          {params.right}
        </ToolbarGroup>
      );
    }
    return (
      <Toolbar>
        <ToolbarGroup key={0} float="left">
          <span style={{
            paddingRight: '16px',
            lineHeight: '56px',
            fontSize: '20px',
            display: 'inline-block',
            position: 'relative',
            float: 'left',
            color: '#666'
          }}>{params.label} &nbsp; {params.count}</span>
        </ToolbarGroup>
        {rightToolbar}
      </Toolbar>
    );
  },

  renderGrid(props, mapper, empty='No results.') {
    if (!props || !props.results || !props.results.length) {
      return <div className="empty center">{empty}</div>;
    }
    if (mapper) {
      props.results = props.results.map(mapper);
    }
    props.fields = props.fields ||
      Object.keys(props.results[0]).map(fieldName => ({name: fieldName}));
    props.table = props.table || {};
    props.header = props.header || {};
    props.body = props.body || {};
    let tableFields = props.fields.map(field => {
      return <TableHeaderColumn key={field.name + '-hc'}>{field.name}</TableHeaderColumn>
    })
    let tableRows = props.results.map((item, i) => {
      return (
        <TableRow key={i}>
          {props.fields.map(field => {
            return <TableRowColumn key={field.name + '-rc'}>{item[field.name]}</TableRowColumn>
          })}
        </TableRow>
      );
    });
    return (
      <Table {...props.table}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false} {...props.header}>
          <TableRow>
            {tableFields}
          </TableRow>
        </TableHeader>
        <TableBody stripedRows={true} displayRowCheckbox={false} {...props.body}>
          {tableRows}
        </TableBody>
      </Table>
    );
  }

};
