// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import prismjs from 'prismjs';
import 'prismjs/components/prism-javascript';

@radium
export default class TaskJsonView extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    style: PropTypes.any
  };

  static defaultProps = {
    className: '',
    css: {},
    style: {}
  };

  css = {
    root: {},
    pre: {
      padding: 0,
      margin: 0
    },
    code: {
      padding: 0,
      margin: 0,
      width: '100%',
      maxHeight: 400,
      overflow: 'auto'
    }
  };

  componentDidMount() {}

  render() {
    let css = {
      root: [this.css.root, this.props.css.root, this.props.style],
      pre: [this.css.pre, this.props.css.pre],
      code: [this.css.code, this.props.css.code]
    };

    let objectJSON = this.props.object ? (
      <pre style={css.pre}>
        <code style={css.code} className="language-json"
          dangerouslySetInnerHTML={{__html:
            prismjs.highlight(JSON.stringify(this.props.object, ' ', 2), prismjs.languages['javascript'], 'javascript')
          }}>
        </code>
      </pre>
    ) : null;

    return (
      <div className={this.props.className} style={css.root}>
        {objectJSON}
      </div>
    );
  }
}
