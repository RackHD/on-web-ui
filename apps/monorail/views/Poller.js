'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import { LinearProgress } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import PollerStore from '../stores/PollerStore';
let poller = new PollerStore();

@mixin.decorate(PageHelpers)
export default class Poller extends Component {

  state = {
    poller: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchPoller = poller.watchOne(this.getPollerId(), 'poller', this);
    this.readPoller();
  }

  componentWillUnmount() { this.unwatchPoller(); }

  render() {
    return (
      <div className="Poller">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'pollers', label: 'Pollers'},
          this.getPollerId()
        )}
        {this.state.loading ? <LinearProgress mode="indeterminate"  /> : null}
        <JsonInspector
            search={false}
            isExpanded={() => true}
            data={this.state.poller || {}} />
      </div>
    );
  }

  getPollerId() { return this.props.pollerId || this.props.params.pollerId; }

  readPoller() {
    this.setState({loading: true});
    poller.read(this.getPollerId()).then(() => this.setState({loading: false}));
  }

}
