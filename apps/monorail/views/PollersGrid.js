'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    LinearProgress
  } from 'material-ui';

import PollerStore from '../stores/PollerStore';
let pollers = new PollerStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class PollersGrid extends Component {

  state = {
    pollers: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchPollers = pollers.watchAll('pollers', this);
    this.listPollers();
  }

  componentWillUnmount() { this.unwatchPollers(); }

  render() {
    return (
      <div className="PollersGrid">
        {this.renderGridToolbar({
          label: <a href="#/pollers">Pollers</a>,
          count: this.state.pollers && this.state.pollers.length || 0
        })}
        {this.state.loading ? <LinearProgress mode="indeterminate"  /> : <div className="clearfix"></div>}
        {
          this.renderGrid({
            results: this.state.pollers,
            resultsPerPage: this.props.size || 50
          }, poller => (
            {
              ID: <a href={this.routePath('pollers', poller.id)}>{this.shortId(poller.id)}</a>,
              Name: poller.name,
              Created: this.fromNow(poller.createdAt),
              Updated: this.fromNow(poller.updatedAt)
            }
          ), 'No pollers.')
        }
      </div>
    );
  }

  listPollers() {
    this.setState({loading: true});
    pollers.list().then(() => this.setState({loading: false}));
  }

}
