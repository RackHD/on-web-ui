// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import prismjs from 'prismjs';
import 'prismjs/components/prism-javascript';

/**
# WELibraryItem

@object
  @type class
  @extends React.Component
  @name FileTreeBrowser
  @desc
*/

export default class WELibraryItem extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    onSelect: PropTypes.func,
    style: PropTypes.any
  };

  static defaultProps = {
    className: '',
    css: {},
    onSelect: function () {},
    style: {}
  };

  state = {
    showJSON: false
  };

  css = {
    root: {
      marginBottom: 0,
      borderBottom: '1px dotted #ddd',
      padding: 0,
      listStyle: 'none',
      lineHeight: '2em'
    },
    a: {
      display: 'inline-block',
      margin: '0 5px',
      background: '#fff',
      cursor: 'pointer',
      color: '#39f',
      ':hover': {
        color: '#369'
      }
    },
    pre: {
      fontFamily: 'monospace, monospace',
      fontSize: '12px',
      overflow: 'hidden',
      padding: 0,
      margin: 0
    },
    code: {
      overflow: 'auto',
      padding: 0,
      margin: 0
    }
  };

  componentDidMount() {}

  render() {
    var css = {
      root: [this.css.root, this.props.css.root, this.props.style],
      a: [this.css.a, this.props.css.a],
      pre: [this.css.pre, this.props.css.pre],
      code: [this.css.code, this.props.css.code]
    };

    let objectJSON = this.props.object && this.state.showJSON ? (
      <pre style={css.pre}>
        <code style={css.code} className="language-json"
          dangerouslySetInnerHTML={{__html:
            prismjs.highlight(JSON.stringify(this.props.object, ' ', 2), prismjs.languages['javascript'], 'javascript')
          }}>
        </code>
      </pre>
    ) : null;

    return (
      <li className={this.props.className} style={css.root}>
        <a
            title="View JSON data."
            style={{display: 'inline-block', margin: '0 5px'}}
            onClick={this.toggle.bind(this)}
            className={'fa fa-search-' + (this.state.showJSON ? 'minus' : 'plus')} />
        {this.props.children}
        <a
            title="Add this to the current workflow."
            style={css.a}
            onClick={this.onSelect.bind(this)}>
          {this.props.name}
        </a>
        {objectJSON}
      </li>
    );
  }

  onSelect(e) {
    if (this.props.onSelect) { this.props.onSelect(e); }
  }

  toggle() {
    this.setState({showJSON: !this.state.showJSON});
  }

}
