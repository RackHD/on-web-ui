'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import marked from 'marked';
import cod from 'cod';
import highlight from 'highlight.js';
import hljs from 'highlight.js/lib/languages/javascript';

highlight.initHighlightingOnLoad();

marked.setOptions({
  langPrefix: 'hljs ',
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});

import http from 'superagent';
let { codeServer } = window.config;

function doc(cod) {
  return [
    <pre key={0} dangerouslySetInnerHTML={{__html: JSON.stringify(cod, null, 2)}} />,
    <h1 key={1}>{cod.object.name} <sub>{cod.object.type}</sub> {cod.object.extends}</h1>,
    <p key={2}>{cod.object.desc}</p>,
    cod.method.map(function (method, index) {
      return (
        <div key={30 + index} className="method">
          <h2>{method.name}</h2>
          <p>{method.desc}</p>
        </div>
      );
    })
  ];
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
  @name HomePage
  @desc Home page component
*/
export default class HomePage extends Component {

  state = {}

  componentDidMount() {
    this.getApps().then(body => {
      this.setState({apps: body});
    });
    this.getReadMe().then(body => {
      console.log('readme', body);
      this.setState({readme: marked(body)});
    });
    this.getHandbookHomePage().then(body => {
      this.setState({script: {
        source: body,
        code: marked('```javascript\n' + body + '\n```'),
        docs: doc(cod(body, {
          docsBegin: '/**',
          docsEnd: '*/',
          pretty: true
        }))
      }});
    });
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="HomePage container">
        Welcome to the Home page.
        <div ref="apps">{this.state.apps}</div>
        <div ref="readme" dangerouslySetInnerHTML={{__html: this.state.readme}} />
        {this.state.script ? [
          <div ref="docs" key={0}>{this.state.script.docs}</div>,
          <div ref="code" key={1} dangerouslySetInnerHTML={{__html: this.state.script.code}} />
        ] : null}
      </div>
    );
  }

  /**
  @method
    @name getApps
    @desc Sends a HTTP request to get a list of app directories.
  */
  getApps() {
    return new Promise(function (resolve, reject) {
      http.get(codeServer + '/')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.text);
        });
    });
  }

  /**
  @method
    @name getReadMe
    @desc Sends a HTTP request to get a README about apps.
  */
  getReadMe() {
    return new Promise(function (resolve, reject) {
      http.get(codeServer + '/README.md')
        .end((err, res) => {
          if (err) { return reject(err); }
          console.log('readme res', res);
          resolve(res && res.text);
        });
    });
  }

  /**
  @method
    @name getHandbookHomePage
    @desc Sends a HTTP request to get this source file in raw text.
  */
  getHandbookHomePage() {
    return new Promise(function (resolve, reject) {
      http.get(codeServer + '/handbook/views/HomePage.js')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.text);
        });
    });
  }

}
