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
import hljs from 'highlight.js/lib/languages/javascript';

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

function doc(cod) {
  if (!Array.isArray(cod.method)) {
    cod.method = [cod.method]
  }
  try {
    return [
      <h1 key={0}>{cod.object.name} <sub>{cod.object.type}</sub> {cod.object.extends}</h1>,
      <p key={1}>{cod.object.desc}</p>,
      cod.method.map(function (method, index) {
        if (!method) { return null; }
        return (
          <div key={20 + index} className="method">
            <h2>{method.name}</h2>
            <p>{method.desc}</p>
          </div>
        );
      })//,
      // <pre key={3} dangerouslySetInnerHTML={{__html: JSON.stringify(cod, null, 2)}} />,
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
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
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
    readme: null,
    docs: null,
    code: null
  }

  componentDidMount() {
    this.load('README.md');
  }

  render() {
    return (
      <Tabs ref="tabs" initialSelectedIndex={0}>
        <Tab label="Source Code">
          <div ref="code" dangerouslySetInnerHTML={{__html: this.state.code}} />
        </Tab>
        <Tab label="API Documentation">
          <div ref="docs">{this.state.docs}</div>
        </Tab>
        <Tab label="Read Me">
          <div ref="readme" dangerouslySetInnerHTML={{__html: this.state.readme}} />
        </Tab>
      </Tabs>
    );
  }

  load(file) {
    console.log('load', file)
    this.getFile(file).then(body => {
      var info = cod(body, {
        docsBegin: '/**',
        docsEnd: '*/',
        pretty: true
      });
      console.log('update', file);
      this.setState({
        readme: marked(info['!text'] || ''),
        // Note: three ticks breaks source highlighting. A pound sign will be append after three ticks.
        code: marked('```javascript\n' + body.replace(/^```/mg, '```#') + '\n```'),
        docs: doc(info)
      });
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
