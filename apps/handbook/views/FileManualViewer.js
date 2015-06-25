/**
# FileManualViewer

*/
'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import {
    Tabs,
    Tab
  } from 'material-ui';

import marked from 'marked';
import cod from 'cod';
import highlight from 'highlight.js';
import 'highlight.js/lib/languages/javascript';

highlight.initHighlightingOnLoad();

marked.setOptions({
  langPrefix: 'hljs ',
  highlight: function (code, lang) {
    if (!lang) { return code; }
    return highlight.highlightAuto(code).value;
  }
});

import http from 'superagent';
let { codeServer } = window.config;

function doc(info) {
  if (!info.object) { return null; }
  if (!Array.isArray(info.method)) {
    info.method = [info.method];
  }
  try {
    return [
      <h1 key={0}>{info.object.name} <sub>{info.object.type}</sub> {info.object.extends}</h1>,
      <p key={1}>{info.object.desc}</p>,
      info.method.map(function (method, index) {
        if (!method) { return null; }
        return (
          <div key={20 + index} className="method">
            <h2>{method.name}</h2>
            <p>{method.desc}</p>
          </div>
        );
      })
    ];
  } catch (err) {
    return err;
  }
}

@radium
@mixin.decorate(DeveloperHelpers)
@mixin.decorate(PageHelpers)
@mixin.decorate(RouteHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    file: PropTypes.string,
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
    file: 'README.md',
    style: null
  }
})
/**
@object
  @type class
  @extends React.Component
  @name FileManualViewer
  @desc File manual viewer component
*/
export default class FileManualViewer extends Component {

  state = {
    file: null,
    ext: null,
    md: null,
    js: null,
    docs: null,
    unknown: false
  }

  componentDidMount() {
    this.load(this.props.file);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.file !== nextProps.file) {
      this.load(nextProps.file);
    }
  }

  render() {
    var tabs = [];
    if (this.state.md) {
      tabs.push(
        <Tab label="Markdown">
          <div ref="md" dangerouslySetInnerHTML={{__html: this.state.md}} />
        </Tab>
      );
    }
    if (this.state.docs) {
      tabs.push(
        <Tab label="API">
          <div ref="docs">{this.state.docs}</div>
        </Tab>
      );
    }
    if (this.state.js) {
      tabs.push(
        <Tab label="JavaScript">
          <div ref="js" dangerouslySetInnerHTML={{__html: this.state.js}} />
        </Tab>
      );
    }
    if (this.state.unknown) {
      tabs.push(
        <Tab label="Unknown Source">
          <div ref="unknown" dangerouslySetInnerHTML={{__html: this.state.unknown}} />
        </Tab>
      );
    }
    return (
      <div>
        <p style={{marginTop: '-1em'}}>{this.state.file}</p>
        {tabs.length &&
          <Tabs ref="tabs"
              initialSelectedIndex={0}
              style={{background: 'white', padding: 10, borderRadius: 5}}>
            {tabs}
          </Tabs> || null}
      </div>
    );
  }

  load(file) {
    var ext = file.split('.').pop();
    this.getFile(file).then(body => {
      var newState = {
            file: file,
            ext: ext,
            md: null,
            js: null,
            docs: null,
            unknown: false
          },
          info;
      if (ext === 'md' && body) {
        newState.md = marked(body);
      }
      else if (ext === 'js') {
        info = cod(body, {docsBegin: '/**', docsEnd: '*/', pretty: false});
        newState.md = info['!text'] && marked(info['!text']);
        // Note: three ticks breaks source highlighting. A pound sign will be append after three ticks.
        newState.js = marked('```javascript\n' + body.replace(/^```/mg, '```#') + '\n```');
        newState.docs = doc(info);
      }
      // TODO: support images
      else {
        newState.unknown = body;
      }
      this.setState(newState);
    });
  }

  /**
  @method
    @name getHandbookHomePage
    @desc Sends a HTTP request to get this source file in raw text.
  */
  getFile(file) {
    if (!file) {
      throw new Error('Missing file argument.');
    }
    return new Promise(function (resolve, reject) {
      http.get(codeServer + '/' + file)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.text);
        });
    });
  }

}
