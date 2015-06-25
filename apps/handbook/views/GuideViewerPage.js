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
import http from 'superagent';
let { codeServer } = window.config;

@radium
@mixin.decorate(DeveloperHelpers)
@mixin.decorate(PageHelpers)
@mixin.decorate(RouteHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    params: PropTypes.object,
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
    params: {},
    style: null
  }
})
export default class GuideViewerPage extends Component {

  state = {
    guide: null
  }

  componentDidMount() {
    this.load();
  }

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.params.guide !== nextProps.params.guide) {
      this.load(nextProps);
    }
  }

  render() {
    return (
      <div className="GuideViewerPage container">
        <div ref="md" dangerouslySetInnerHTML={{__html: this.state.guide}} />
      </div>
    );
  }

  load(props) {
    props = props || this.props;
    var path = 'handbook/views/guides/' + props.params.guide + '.md';
    this.getGuide(path).then(body => {
      this.setState({guide: marked(body)});
    });
  }

  /**
  @method
    @name getGuide
    @desc Sends a HTTP request to get a file.
  */
  getGuide(path) {
    path = path || '';
    return new Promise(function (resolve, reject) {
      http.get(codeServer + '/' + path)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.text);
        });
    });
  }

}
