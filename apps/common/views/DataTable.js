// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

export default class DataTable extends Component {

  static propTypes = {
    className: PropTypes.string,
    dataKey: PropTypes.string,
    emptyContent: PropTypes.string,
    fields: PropTypes.array,
    initialData: PropTypes.array,
    uniqueName: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    className: '',
    dataKey: 'id',
    emptyContent: 'No data.',
    fields: {},
    initialData: [],
    uniqueName: '',
    style: {}
  };

  state = {data: this.props.initialData};

  update(data) {
    this.setState({data: data});
  }

  render() {
    if (this.state.data.length === 0) {
      return (
        <div className={'empty ' + this.props.className} style={this.props.style}>
          {this.props.emptyContent}
        </div>
      );
    }
    return (
      <table className={this.props.className} style={this.props.style}>
        <thead>
          <tr>
            {this.fieldElements}
          </tr>
        </thead>
        <tbody>
          {this.rowElements}
        </tbody>
      </table>
    );
  }

  get fieldElements() {
    return this.props.fields.map((field, i) => {
      var key = field.property ? field.property.replace('.', '-') : 'h' + i;
      if (this.props.uniqueName) { key = this.props.uniqueName + key; }
      return (
        <th key={key} className={field.className} style={field.style}>{field.label}</th>
      );
    });
  }

  get rowElements() {
    if (!this.state.data || !this.state.data.map) {
      throw new Error('Invalid data supplied to DataTable.');
    }
    var dataKey = this.props.dataKey;
    return this.state.data.map((data, ri) => {
      var cells = this.props.fields.map((field, ci) => {
        return this.getCellElement(field, data, ri, ci);
      });
      return (
        <tr key={(data[dataKey] || '') + 'r' + ri}>{cells}</tr>
      );
    });
  }

  getCellElement(field, data, ri, ci) {
    var prop = field.property;
    if (!prop && !field.func) { return null; }
    if (prop && prop.indexOf('.') !== -1) {
      var props = prop.split('.'), p;
      prop = props.pop();
      do {
        p = props.shift();
        data = p && data && data[p];
      } while(data && props.length);
    }
    var value = prop ? data && data[prop] : (field.func && data);
    if (field.func) { value = field.func(value); }
    value = value || field.default;
    return (
      <td key={'c' + (prop || '') + ci + ri} className={field.className} style={field.style}>{value}</td>
    );
  }

}
