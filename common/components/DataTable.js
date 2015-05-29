'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorateComponent from '../lib/decorateComponent';
/* eslint-enable no-unused-vars */

@decorateComponent({
  propTypes: {
    className: PropTypes.string,
    dataKey: PropTypes.string,
    emptyContent: PropTypes.string,
    fields: PropTypes.array,
    initialData: PropTypes.array,
    style: PropTypes.object
  },
  defaultProps: {
    className: '',
    dataKey: 'id',
    emptyContent: 'No data.',
    fields: {},
    initialData: [],
    style: {}
  }
})
export default class DataTable extends Component {

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
      return (
        <th key={field.property || i}>{field.label}</th>
      );
    });
  }

  get rowElements() {
    if (!this.state.data || !this.state.data.map) {
      throw new Error('Invalid data supplied to DataTable.');
    }
    var dataKey = this.props.dataKey;
    return this.state.data.map((data, i) => {
      var cells = this.props.fields.map(field => {
        return this.getCellElement(field, data);
      });
      return (
        <tr key={data[dataKey] || i}>{cells}</tr>
      );
    });
  }

  getCellElement(field, data) {
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
      <td>{value}</td>
    );
  }

}
