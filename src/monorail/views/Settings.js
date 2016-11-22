// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import { RouteHandler, Link } from 'react-router';
import {
    RaisedButton,
    TextField,
    Toggle
  } from 'material-ui';

import Swagger from 'swagger-client';
import RackHD from 'src-rackhd-client';

import config from 'src-config/index';
import UserLogin from 'src-common/views/UserLogin';

import LoginRestAPI from 'src-rackhd-client/LoginRestAPI';

import EndpointInput from './EndpointInput';

@radium
export default class Settings extends Component {

  static defaultProps = {
    css: {}
  };

  static contextTypes = {
    router: PropTypes.any
  };

  componentDidMount() {
    setTimeout(() => {
      this.monorailAPICheck({
        resolve: this.refs.monorailAPI.resolve,
        reject: this.refs.monorailAPI.reject
      });
      this.rackhdAPICheck({
        resolve: this.refs.rackhdAPI.resolve,
        reject: this.refs.rackhdAPI.reject
      });
    }, 0);
  }

  css = {
    root: {}
  };

  state = {
    authError: null,
    enableSSL: this.enableSSL,
    enableAuth: this.enableAuth,
    elasticsearchAPI: this.elasticsearchAPI,
    monorailAPI: this.monorailAPI,
    monorailWSS: this.monorailWSS,
    rackhdAPI: this.rackhdAPI,
    rackhdAuthToken: this.rackhdAuthToken,
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

    // {showHelp && <p style={{background: 'red', padding: 5, borderRadius: 5, color: 'white'}}>
    //   Failed to reach RackHD API Endpoints, please correctly adjust these settings.
    // </p>}

    return (
      <div style={css.root}>
        <div style={{padding: 20}}>
          <p>
            Do not include "http(s)://" or any other protocol when entering API endpoints.
          </p>
          <fieldset>
            <legend style={{padding: 5}}>RacKHD</legend>
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
            {this.state.enableAuth && <fieldset style={{width: '80%'}}>
              <legend style={{padding: 5}}>Authentication</legend>
              <UserLogin header="" submitLabel="Update Auth Token" onSubmit={(user, pass) => {
                let loginAPI = new LoginRestAPI(
                  'http' + (this.enableSSL ? 's' : '') + '://' + this.monorailAPI.split('/')[0]
                );
                loginAPI.authenticate(user, pass)
                  .then(token => {
                    this.rackhdAuthToken = token;
                    this.setState({authError: null, rackhdAuthToken: token});
                  })
                  .catch(err => {
                    this.setState({authError: 'Error:' + err && err.message || err});
                  });
              }}/>
              {this.state.authError && <p style={{color: 'red'}}>{this.state.authError}</p>}
              <TextField
                  ref="rackhdAuthToken"
                  fullWidth={true}
                  multiLine={true}
                  rows={2}
                  hintText="JWT Token"
                  value={this.state.rackhdAuthToken}
                  floatingLabelText="RackHD API Auth Token"
                  onChange={(e) => this.setState({rackhdAuthToken: e.target.value})} />
            </fieldset>}
            <EndpointInput
                ref="rackhdAPI"
                check={this.rackhdAPICheck}
                hintText={this.rackhdAPI}
                value={this.state.rackhdAPI}
                floatingLabelText="RackHD Northbound API v2"
                onChange={({ value, checkCallback }) =>
                  this.setState({rackhdAPI: value}, checkCallback)} />
            <EndpointInput
                ref="monorailAPI"
                check={this.monorailAPICheck}
                fullWidth={true}
                hintText={this.monorailAPI}
                value={this.state.monorailAPI}
                floatingLabelText="RackHD Northbound API v1.1"
                onChange={({ value, checkCallback }) =>
                  this.setState({monorailAPI: value}, checkCallback)} />
            <EndpointInput
                ref="monorailWSS"
                fullWidth={true}
                hintText={this.monorailWSS}
                value={this.state.monorailWSS}
                floatingLabelText="RackHD WebSocket URL"
                onChange={({ value }) => this.setState({monorailWSS: value})} />
            {/*<EndpointInput
                ref="redfishAPI"
                fullWidth={true}
                hintText={this.redfishAPI}
                value={this.state.redfishAPI}
                floatingLabelText="RackHD RedFish API"
                onChange={({ value }) => this.setState({redfishAPI: value})} />*/}
          </fieldset>
          <fieldset style={{marginTop: 20}}>
            <legend style={{padding: 5}}>Elasticsearch</legend>
            <TextField
                ref="elasticsearchAPI"
                fullWidth={true}
                hintText={this.elasticsearchAPI}
                value={this.state.elasticsearchAPI}
                floatingLabelText="Elasticsearch API"
                onChange={(e) => this.setState({elasticsearchAPI: e.target.value})} />
          </fieldset>
          <div style={{textAlign: 'left', marginTop: 20}}>
            <RaisedButton secondary={true} label="Apply Settings" onClick={this.updateSettings.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }

  getConfigBoolean(key) {
    let localValue = window.localStorage.getItem(key);
    if (typeof localValue === 'string') { localValue = localValue === 'true'; }
    if (typeof localValue === 'boolean') { return localValue; }
    return config[key];
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

  get rackhdAuthToken() { return this.getConfigValue('RackHD_API_Auth_Token'); }
  set rackhdAuthToken(value) { return this.setConfigValue('RackHD_API_Auth_Token', value); }

  get redfishAPI() { return this.getConfigValue('RedFish_API'); }
  set redfishAPI(value) { return this.setConfigValue('RedFish_API', value); }

  updateSettings() {
    this.elasticsearchAPI = this.state.elasticsearchAPI;
    this.enableAuth = this.state.enableAuth;
    this.enableSSL = this.state.enableSSL;
    this.monorailAPI = this.state.monorailAPI;
    this.monorailWSS = this.state.monorailWSS;
    this.rackhdAPI = this.state.rackhdAPI;
    this.rackhdAuthToken = this.state.rackhdAuthToken;
    // this.redfishAPI = this.state.redfishAPI;
    this.context.router.push('/settings');
    setTimeout(() => window.location.reload(), 250);
  }

  get rackhdProtocol() {
    return 'http' + (this.state.enableSSL ? 's' : '') + '://';
  }

  monorailAPICheck = ({ resolve, reject }) => {
    let api1_1 = RackHD.v1_1.create(
      this.rackhdProtocol + this.state.monorailAPI,
      this.state.enableAuth == true &&
        this.state.rackhdAuthToken || null);
    api1_1.config.get().
      then(() => resolve('Connected to RackHD 1.1 endpoint!')).
      catch(() => reject('Failed to reach RackHD 1.1 endpoint.'));
  };

  rackhdAPICheck = ({ resolve, reject }) => {
    let swaggerOptions = {
      usePromise: true,
      authorizations : {},
      url: this.rackhdProtocol + this.state.rackhdAPI + '/swagger'
    };
    if (this.state.enableAuth == true) {
      swaggerOptions.authorizations['Authentication-Token'] =
        new Swagger.ApiKeyAuthorization(
          'Authorization', 'JWT ' + this.state.rackhdAuthToken, 'header');
    }
    new Swagger(swaggerOptions).
      then(() => resolve('Connected to RackHD 2.0 endpoint!')).
      catch(() => reject('Failed to reach RackHD 2.0endpoint.'));
  };

}
