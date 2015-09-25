// Copyright 2015, EMC, Inc.

'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'common-web-ui/lib/mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import { Menu } from 'material-ui';
import marked from 'marked';
import http from 'superagent';
import { codeServer } from '../config/index';

@radium
@mixin(DeveloperHelpers)
@mixin(PageHelpers)
@mixin(RouteHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    params: PropTypes.object,
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
    params: {},
    style: {}
  }
})
export default class GuideViewerPage extends Component {

  state = {
    guide: null,
    menuItems: null
  }

  componentDidMount() {
    this.load();
    this.getGuideMenu().then(guides => {
      var menuItems = guides.map(guide => {
        guide = guide.split('.')[0];
        var name = guide.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return { text: <a href={'#/guides/' + guide}>{name}</a> };
      });
      this.setState({ menuItems });
    });
  }

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {
    if (this.props.params.guide !== nextProps.params.guide) {
      this.load(nextProps);
    }
  }

  render() {
    var menuItems = this.state.menuItems;
    return (
      <div className="GuideViewerPage container"
          style={{padding: '20px'}}>
        {menuItems && <Menu
          ref="menu"
          menuItems={menuItems}
          style={{width: 200, float: 'right', marginTop: 50, marginLeft: 20}} />}
        <div ref="guide" dangerouslySetInnerHTML={{__html: this.state.guide}} />
      </div>
    );
  }

  load(props) {
    props = props || this.props;
    var guide = props.params.guide || 'app_tutorial',
        path = 'handbook/views/guides/' + guide + '.md';
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
    return new Promise((resolve, reject) => {
      http.get(codeServer + '/' + path)
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(res && res.text);
        });
    });
  }

  /**
  @method
    @name getGuideMenu
    @desc Sends a HTTP request to get a list of files.
  */
  getGuideMenu() {
    return new Promise((resolve, reject) => {
      http.get(codeServer + '/handbook/views/guides')
        .end((err, res) => {
          if (err) { return reject(err); }
          resolve(JSON.parse(res && res.text));
        });
    });
  }

}
