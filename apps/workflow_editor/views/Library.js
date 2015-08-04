'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';

import { TextField } from 'material-ui';

/**
# WELibrary

@object
  @type class
  @extends React.Component
  @name WELibrary
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
export default class WELibrary extends Component {

  state = {
    filteredChildren: null
  };

  css = {
    root: {
      padding: 10,
      background: '#fff'
    },
    search: {
      marginTop: '-20px'
    },
    ul: {
      // maxHeight: 500,
      overflow: 'auto',
      userSelect: 'none',
      borderTop: '1px dotted #ddd',
      fontSize: '14px',
      margin: 0,
      padding: 0
    }
  };

  componentDidMount() {
    this.growTrie(this.props.children);
  }

  componentWillReceiveProps(nextProps) {
    this.growTrie(nextProps.children);
  }

  render() {
    var css = {
      root: [this.css.root, this.props.css.root, this.props.style],
      search: [this.css.search, this.props.css.search],
      ul: [this.css.ul, /*{maxHeight: window.innerHeight - 200},*/ this.props.css.ul]
    };
    var empty = null;
    if (!React.Children.count(this.props.children)) {
      empty = <li>Library is empty.</li>;
    }
    return (
      <div className={this.props.className} style={css.root}>
        <div style={css.search}>
          <TextField
              ref="search"
              fullWidth={true}
              floatingLabelText="Search"
              onBlur={this.clearSearch.bind(this)}
              onChange={this.updateSearch.bind(this)} />
          </div>
        <ul ref="list" style={css.ul}>
          {this.state.filteredChildren || empty || this.props.children}
        </ul>
      </div>
    );
  }

  /**
  @method
    @name growTrie
    @desc
  */
  growTrie() {
    this.trie = {};

    React.Children.forEach(this.props.children, child => {
      var name = //child.key || child.props.children ||
                 child.props.object && child.props.object.friendlyName,
          words = name && name.toLowerCase().split(/\s+/) || [];
      // if (!name) {debugger;}

      words.forEach(word => {
        var letters = word.split(''),
            trie = this.trie;

        letters.forEach(letter => {
          trie = trie[letter] = trie[letter] || {results: []};
          trie.results.push(child);
        });
      });
    });
  }

  updateSearch() {
    var search = this.refs.search.getValue().toLowerCase(),
        words = search.split(/\s+/),
        results = [];

    words.forEach(word => {
      var letters = word.split(''),
          trie = this.trie;

      letters.forEach(letter => {
        trie = trie[letter] || trie;
      });

      if (trie && trie.results) {
        trie.results.forEach(item => {
          if (results.indexOf(item === -1)) {
            results.push(item);
          }
        });
      }
    });

    var filteredChildren = (results && results.length) ? results : null;

    this.setState({ filteredChildren });
  }

  clearSearch() {
    // setTimeout(() => {
    //   this.refs.search.setValue('');
    //   this.setState({filteredChildren: null});
    // }, 500);
  }

}
