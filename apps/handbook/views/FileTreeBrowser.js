'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';

import { TextField } from 'material-ui';

import http from 'superagent';
import { codeServer } from '../config/index';

function alpha (a, b) {
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  return 0;
}

/**
# FileTreeBrowser

The `FileTreeBrowser` component is used to generate the documentation menu.

@object
  @type class
  @extends React.Component
  @name FileTreeBrowser
  @desc File tree browser component
*/

@radium
@mixin.decorate(DeveloperHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    collapsed: PropTypes.bool,
    css: PropTypes.object,
    lazy: PropTypes.bool,
    nested: PropTypes.bool,
    onSelect: PropTypes.func,
    path: PropTypes.string,
    style: PropTypes.any,
    trie: PropTypes.object
  },

  defaultProps: {
    className: '',
    collapsed: false,
    css: {},
    lazy: true,
    nested: false,
    onSelect: null,
    path: '',
    style: {},
    trie: {}
  }
})
export default class FileTreeBrowser extends Component {

  state = {
    open: !this.props.collapsed,
    files: null,
    results: null
  };

  css = {
    ulNested: {
      marginLeft: 0,
      paddingLeft: 0
    },
    liSearch: {
      padding: 0,
      marginBottom: 0
    },
    aFile: {
      color: '#39f',
      ':hover': {
        color: '#369'
      }
    },
    ul: {
      userSelect: 'none',
      borderTop: '1px dotted #ddd',
      maxWidth: 256,
      fontSize: '14px',
      marginTop: 0,
      paddingLeft: '10px',
      marginBottom: 0
    },
    li: {
      marginBottom: 0,
      borderBottom: '1px dotted #ddd',
      padding: '0 0 0 10px',
      listStyle: 'none',
      lineHeight: '2em'
    },
    a: {
      background: 'white',
      color: '#555',
      cursor: 'pointer',
      ':hover': {
        color: '#111'
      }
    }
  };

  componentDidMount() {
    if (!this.props.lazy) { this.load(); }
  }

  render() {
    var files = this.state.files || [],
        open = this.state.open || this.state.results,
        dirs = [],
        list;

    var css = {
      ul: [this.css.ul, this.props.css.ul],
      li: [this.css.li, this.props.css.li],
      a: [this.css.a, this.props.css.a]
    };

    css.aFile = css.a.concat([this.css.aFile, this.props.css.aFile]);

    if (this.props.nested) {
      css.ul = css.ul.concat([this.css.ulNested, this.props.css.ulNested]);
    }

    css.ul.push({display: open ? 'block' : 'none'});

    files.sort(alpha);
    files = files.filter(file => {
      if (this.isDirectory(file)) {
        dirs.push(file);
        return false;
      }

      var letters = file.toLowerCase().split(''),
          trie = this.props.trie;
      letters.forEach(letter => {
        trie = trie[letter] = trie[letter] || {results: {}};
        var full = this.props.path + file;
        trie.results[full] = true;
      });

      return true;
    });

    dirs.sort(alpha);
    this.files = files;
    this.dirs = dirs;

    dirs = dirs.map(dir => {
      var path = this.props.path ? this.props.path + dir : dir;

      return (
        <li key={dir} style={css.li}>
          <a key={dir + '-a'} style={css.a} onClick={this.toggleDir.bind(this, dir)}>{dir}</a>
          <FileTreeBrowser
              ref={dir}
              className={this.props.className}
              collapsed={true}
              css={this.props.css}
              lazy={this.props.lazy}
              nested={true}
              onSelect={this.props.onSelect}
              path={path}
              style={this.props.style}
              trie={this.props.trie} />
        </li>
      );
    });

    files = files.map(file => {
      return (
        <li key={file} style={css.li}>
          <a key={file + '-a'} style={css.aFile} onClick={this.selectFile.bind(this, file)}>{file}</a>
        </li>
      );
    });

    if (open) {
      if (!this.state.files) {
        return <ul style={css.ul}><li style={css.li}>Loading...</li></ul>;
      }
      if (!files.length) {
        return <ul style={css.ul}><li style={css.li}>Empty</li></ul>;
      }
    }

    if (this.state.results) {
      list = Object.keys(this.state.results).map(file => {
        return (
          <li key={file} style={css.li}>
            <a key={file + '-a'} style={css.aFile} onClick={this.selectAbsoluteFile.bind(this, file)}>{file}</a>
          </li>
        );
      });
    }

    else { list = dirs.concat(files); }

    return (
      <ul style={css.ul}>
        {this.renderSearch()}
        {list}
      </ul>
    );
  }

  renderSearch() {
    if (this.props.nested) { return null; }
    var css = [this.css.li, this.props.css.li, this.css.liSearch, this.props.css.liSearch];
    return (
      <li style={css}>
        <TextField
            ref="search"
            floatingLabelText="Search"
            onBlur={this.clearSearch.bind(this)}
            onChange={this.updateSearch.bind(this)} />
      </li>
    );
  }

  load() {
    return this.getFiles(this.props.path).then(files => {
      files = files || [];
      this.setState({ files });
    });
  }

  expand() {
    return this.load().then(() => {
      this.setState({open: true});
    });
  }

  collapse() {
    this.setState({open: false});
  }

  toggle() {
    if (this.state.open) { return this.collapse(); }
    return this.expand();
  }

  /**
  @method
    @name getFiles
    @desc Sends a HTTP request to get a list of files.
  */
  getFiles(path) {
    path = path || '';
    return new Promise((resolve, reject) => {
      http.get(codeServer + '/' + path)
        .end((err, res) => {
          if (err) { return reject(err); }
          var files = [];
          if (res && res.text) {
            try { files = JSON.parse(res.text); }
            catch (_err) { files = []; }
          }
          resolve(files);
        });
    });
  }

  toggleDir(dir, event) {
    event.preventDefault();
    this.refs[dir].toggle();
  }

  isDirectory(file) {
    return file.charAt(file.length - 1) === '/';
  }

  selectFile(file, event) {
    event.preventDefault();
    if (this.props.onSelect) { this.props.onSelect(this.props.path + file); }
  }

  selectAbsoluteFile(file, event) {
    event.preventDefault();
    if (this.props.onSelect) { this.props.onSelect(file); }
  }

  updateSearch() {
    var search = this.refs.search.getValue().toLowerCase().split(''),
        trie = this.props.trie;

    search.forEach(letter => {
      trie = trie[letter] || trie;
    });

    this.setState({results: trie && trie.results || null});
  }

  clearSearch() {
    setTimeout(() => {
      this.refs.search.setValue('');
      this.setState({results: null});
    }, 500);
  }

}
