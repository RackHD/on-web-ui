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
import docchi from 'docchi';

import http from 'superagent';
let { codeServer } = window.config;

// console.log(codeServer);

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
      this.setState({script: docchi.parse(body)});
    });
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="HomePage container">
        Welcome to the Home page.
        <div ref="apps">{this.state.apps}</div>
        <div ref="readme" dangerouslySetInnerHTML={{__html: this.state.readme}} />

      </div>
    );
  }

  getApps() {
    return new Promise(function (resolve, reject) {
      http.get(codeServer + '/')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.text);
        });
    });
  }

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
