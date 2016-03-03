// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';
import { RouteHandler, Link } from 'react-router';
import {
    AppCanvas,
    Avatar,
    FontIcon,
    IconButton,
    List,
    ListItem,
    RaisedButton,
    TextField,
    Toolbar,
    ToolbarGroup,
    ToolbarTitle
  } from 'material-ui';

import config from 'rui-common/config/index';
// import EMCTab from 'rui-common/views/EMCTab';
import emcTheme from 'rui-common/lib/emcTheme';

@radium
export default class Settings extends Component {

  static defaultProps = {
    css: {}
  };

  css = {
    root: {}
  };

  state = {};

  render() {
    let { props } = this;

    let css = {
      root: [
        this.css.root,
        props.css.root,
        props.style
      ]
    };

    return (
      <div style={css.root} {...props}>
        <div style={{padding: 20}}>
          <h2 style={{margin: 0}}>Settings</h2>
          <TextField
              ref="monorailAPI"
              fullWidth={true}
              //hintText={this.monorailAPI}
              //defaultValue={this.state.monorailAPI}
              floatingLabelText="RackHD Northbound API v1.1"
              onChange={(e) => {
                this.setState({monorailAPI: e.target.value});
              }} />
          <TextField
              ref="monorailAPI"
              fullWidth={true}
              hintText={this.monorailAPI}
              defaultValue={this.state.monorailAPI}
              floatingLabelText="RackHD Northbound API v2"
              onChange={(e) => {
                this.setState({monorailAPI: e.target.value});
              }} />
          <TextField
              ref="rackhdWsUrl"
              fullWidth={true}
              hintText={this.monorailAPI}
              defaultValue={this.state.rackhdWsUrl}
              floatingLabelText="RackHD WebSocket URL"
              onChange={(e) => {
                this.setState({rackhdWsUrl: e.target.value});
              }} />
          <TextField
              ref="elasticsearchAPI"
              fullWidth={true}
              hintText={this.elasticsearchAPI}
              defaultValue={this.state.elasticsearchAPI}
              floatingLabelText="Elasticsearch API"
              onChange={(e) => {
                this.setState({elasticsearchAPI: e.target.value});
              }} />
          <TextField
              ref="redfishAPI"
              fullWidth={true}
              hintText={this.redfishAPI}
              defaultValue={this.state.redfishAPI}
              floatingLabelText="RedFish API"
              onChange={(e) => {
                this.setState({redfishAPI: e.target.value});
              }} />
          <div style={{textAlign: 'right', marginTop: 10}}>
            <RaisedButton secondary={true} label="Apply" onClick={this.updateSettings.bind(this)}/>
          </div>
        </div>
        {/*<EMCTab ref="emcTab" />*/}
      </div>
    );
  }

  get monorailAPI() {
    return window.localStorage.getItem('MONORAIL_API') || config.MONORAIL_API;
  }

  set monorailAPI(value) {
    window.localStorage.setItem('MONORAIL_API', (config.MONORAIL_API = value));
    return value;
  }

  updateSettings() {
    this.monorailAPI = this.state.monorailAPI;
    window.localStorage.setItem('monorail-config', JSON.stringify(config));
    this.setState({activePopover: null}, () => {
      setTimeout(() => window.location.reload(), 250);
    });
  }

}
