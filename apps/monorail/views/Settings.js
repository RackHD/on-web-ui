// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';
import { RouteHandler, Link } from 'react-router';
import {
    RaisedButton,
    TextField,
    Toggle
  } from 'material-ui';

import config from 'rui-common/config/index';
import UserLogin from 'rui-common/views/UserLogin';

@radium
export default class Settings extends Component {

  static defaultProps = {
    css: {}
  };

  css = {
    root: {}
  };

  state = {
    enableSSL: this.enableSSL,
    enableAuth: this.enableAuth,
    elasticsearchAPI: this.elasticsearchAPI,
    monorailAPI: this.monorailAPI,
    monorailWSS: this.monorailWSS,
    rackhdAPI: this.rackhdAPI,
    redfishAPI: this.redfishAPI
  };

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
          <fieldset>
            <legend style={{padding: 5}}>RacKHD Settings</legend>
            <Toggle
                label={(this.state.enableSSL ? 'Disable' : 'Enable') + ' Secure Connections'}
                labelPosition="right"
                onToggle={() => this.setState({enableSSL: !this.state.enableSSL})}
                toggled={this.state.enableSSL} />
            <Toggle
                label={(this.state.enableAuth ? 'Disable' : 'Enable') + ' API Authentication'}
                labelPosition="right"
                onToggle={() => this.setState({enableAuth: !this.state.enableAuth})}
                toggled={this.state.enableAuth} />
            {this.state.enableAuth && <UserLogin />}
            <TextField
                ref="rackhdAPI"
                fullWidth={true}
                hintText={this.rackhdAPI}
                defaultValue={this.state.rackhdAPI}
                floatingLabelText="RackHD Northbound API v2"
                onChange={(e) => this.setState({monorailAPI: e.target.value})} />
            <TextField
                ref="monorailAPI"
                fullWidth={true}
                hintText={this.monorailAPI}
                defaultValue={this.state.monorailAPI}
                floatingLabelText="RackHD Northbound API v1.1"
                onChange={(e) => this.setState({monorailAPI: e.target.value})} />
            <TextField
                ref="monorailWSS"
                fullWidth={true}
                hintText={this.monorailWSS}
                defaultValue={this.state.monorailWSS}
                floatingLabelText="RackHD WebSocket URL"
                onChange={(e) => this.setState({monorailWSS: e.target.value})} />
          </fieldset>
          <TextField
              ref="elasticsearchAPI"
              fullWidth={true}
              hintText={this.elasticsearchAPI}
              defaultValue={this.state.elasticsearchAPI}
              floatingLabelText="Elasticsearch API"
              onChange={(e) => this.setState({elasticsearchAPI: e.target.value})} />
          <TextField
              ref="redfishAPI"
              fullWidth={true}
              hintText={this.redfishAPI}
              defaultValue={this.state.redfishAPI}
              floatingLabelText="RedFish API"
              onChange={(e) => this.setState({redfishAPI: e.target.value})} />
          <div style={{textAlign: 'right', marginTop: 10}}>
            <RaisedButton secondary={true} label="Apply" onClick={this.updateSettings.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }

  getConfigBoolean(key) {
    let localValue = window.localStorage.getItem(key);
    if (typeof localValue === 'string') { localValue = localValue === 'true'; }
    if (typeof localValue === 'boolean') { return localValue; }
    return config[key]
  }

  getConfigValue(key) { return window.localStorage.getItem(key) || config[key]; }

  setConfigValue(key, value) {
    window.localStorage.setItem(key, (config[key] = value));
    return value;
  }

  get elasticsearchAPI() { return this.getConfigValue('Elasticsearch_API'); }
  set elasticsearchAPI(value) { return this.setConfigValue('Elasticsearch_API', value); }

  get enableAuth() { return this.getConfigBoolean('Enable_RackHD_API_Auth'); }
  set enableAuth(value) { return this.setConfigValue('Enable_RackHD_API_Auth', !!value); }

  get enableSSL() { return this.getConfigBoolean('Enable_RackHD_SSL'); }
  set enableSSL(value) { return this.setConfigValue('Enable_RackHD_SSL', !!value); }

  get monorailAPI() { return this.getConfigValue('MonoRail_API'); }
  set monorailAPI(value) { return this.setConfigValue('MonoRail_API', value); }

  get monorailWSS() { return this.getConfigValue('MonoRail_WSS'); }
  set monorailWSS(value) { return this.setConfigValue('MonoRail_WSS', value); }

  get rackhdAPI() { return this.getConfigValue('RackHD_API'); }
  set rackhdAPI(value) { return this.setConfigValue('RackHD_API', value); }

  get redfishAPI() { return this.getConfigValue('RedFish_API'); }
  set redfishAPI(value) { return this.setConfigValue('RedFish_API', value); }

  updateSettings() {
    this.elasticsearchAPI = this.state.elasticsearchAPI;
    this.enableAuth = this.state.enableAuth;
    this.enableSSL = this.state.enableSSL;
    this.monorailAPI = this.state.monorailAPI;
    this.monorailWSS = this.state.monorailWSS;
    this.rackhdAPI = this.state.rackhdAPI;
    this.redfishAPI = this.state.redfishAPI;
    setTimeout(() => window.location.reload(), 250);
  }

}
