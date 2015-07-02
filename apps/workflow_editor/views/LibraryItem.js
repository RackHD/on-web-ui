'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';

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
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
    css: {},
    style: {}
  }
})
export default class WELibraryItem extends Component {

  state = {};

  css = {
    root: {
      marginBottom: 0,
      borderBottom: '1px dotted #ddd',
      padding: '0 0 0 10px',
      listStyle: 'none',
      lineHeight: '2em'
    },
    a: {
      background: '#fff',
      cursor: 'pointer',
      color: '#39f',
      ':hover': {
        color: '#369'
      }
    }
  };

  componentDidMount() {}

  render() {
    var css = {
      root: [this.css.root, this.props.css.root, this.props.style],
      a: [this.css.a, this.props.css.a]
    };

    return (
      <li className={this.props.className} style={css.root}>
        <a style={css.a}>{this.props.children}</a>
      </li>
    );
  }

}
