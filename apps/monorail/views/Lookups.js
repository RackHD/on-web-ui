// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
/* eslint-enable no-unused-vars */

import {
    TextField
  } from 'material-ui';

import LookupStore from '../stores/LookupStore';

@mixin(FormatHelpers)
@mixin(RouteHelpers)
export default class Lookups extends Component {

  state = {
    searchQuery: this.props.initialSearchQuery,
    lookups: []
  };
  lookups = new LookupStore();

  componentDidMount() {
    this.unwatchLookups = this.lookups.watchAll('lookups', this);
    this.search(this.state.searchQuery);
  }

  componentWillUnmount() { this.unwatchLookups(); }

  render() {
    var results = this.state.lookups.map(lookup => {
      return <div>{lookup.name || lookup.id}</div>;
    });
    return (
      <div className="Lookups">
        <TextField
          hintText="Search"
          valueLink={this.linkSearchState()} />
        {results}
      </div>
    );
  }

  linkSearchState() {
    var timer;
    return {
      value: this.state.searchQuery,
      requestChange: searchQuery => {
        this.setState({searchQuery});
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.search(searchQuery);
        }, 50);
      }
    };
  }

  search(term) {
    // TODO: fix lookups api to support text search
    // var query = term ? {$text: {$search: term}} : '';
    return this.lookups.list(term);
  }

}
