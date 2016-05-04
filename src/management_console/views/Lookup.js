// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';

import {
    TextField
  } from 'material-ui';

import LookupStore from 'src-common/stores/LookupStore';

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
    let results = this.state.lookups.map(lookup => {
      return <div>{lookup.name || lookup.id}</div>;
    });
    return (
      <div className="Lookups">
        <TextField
          hintText="Search"
          // valueLink={this.linkSearchState()}
          />
        {results}
      </div>
    );
  }

  linkSearchState() {
    let timer;
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
    // let query = term ? {$text: {$search: term}} : '';
    return this.lookups.list(term);
  }

}
