'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';

import highlight from 'highlight.js';
import 'highlight.js/lib/languages/json';

highlight.initHighlightingOnLoad();

/**
# WELibraryItem

@object
  @type class
  @extends React.Component
  @name FileTreeBrowser
  @desc
*/

@radium
@mixin.decorate(DeveloperHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    css: PropTypes.object,
    onSelect: PropTypes.func,
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
    css: {},
    onSelect: function () {},
    style: {}
  }
})
export default class WELibraryItem extends Component {

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
        <code style={css.code} className="hljs json"
          dangerouslySetInnerHTML={{__html:
            highlight.highlightAuto(JSON.stringify(this.props.object, ' ', 2)).value
          }}>
        </code>
      </pre>
    ) : null;

    return (
      <li className={this.props.className} style={css.root}>
        <a key="a0" style={css.a} onClick={this.toggle.bind(this)} className={'fa fa-search-' + (this.state.showJSON ? 'minus' : 'plus')}></a>
        <a key="a1" style={css.a} onClick={this.onSelect.bind(this)}>{this.props.children}</a>
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
