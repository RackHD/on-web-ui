// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router';

import {
    FlatButton,
    FontIcon,
    IconButton,
    Popover,
    RaisedButton,
    TextField
  } from 'material-ui';

import AppContainer from 'common-web-ui/views/AppContainer';
import emcTheme from 'common-web-ui/lib/emcTheme';

import config from '../config/index';
import { navigation } from '../config/routes';

export default class App extends Component {

  state = {
    navigation,
    monorailAPI: this.monorailAPI
  };

  render() {
    return (
      <AppContainer
          ref="container"
          navigation={this.state.navigation}
          afterContent={[
            <Popover key="settings"
                style={{width: 300}}
                animated={true}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                open={this.state.activePopover === 'settings'}
                anchorEl={this.state.anchorElement}
                onRequestClose={this.closePopover.bind(this, 'settings')} >
              <div style={{padding: 20, border: '1px solid ' + emcTheme.rawTheme.palette.textColor}}>
                <h2 style={{margin: 0}}>Settings</h2>
                <TextField
                    ref="monorailAPI"
                    fullWidth={true}
                    hintText={this.monorailAPI}
                    defaultValue={this.state.monorailAPI}
                    floatingLabelText="MonoRail API Endpoint"
                    onChange={(e) => {
                      this.setState({monorailAPI: e.target.value});
                    }} />
                <div style={{textAlign: 'right'}}>
                  <RaisedButton primary={true} label="Cancel" onClick={this.closePopover.bind(this, 'settings')}/>
                  &nbsp;
                  <RaisedButton secondary={true} label="Apply" onClick={this.updateSettings.bind(this)}/>
                </div>
              </div>
            </Popover>
          ]}
          beforeBreadcrumbs={[
            <Link key={0} to="dashboard" style={{marginRight: '1em'}}>
              <FontIcon className="fa fa-dashboard"
                color={emcTheme.rawTheme.palette.alternateTextColor}
                hoverColor={emcTheme.rawTheme.palette.textColor} />
            </Link>
          ]}
          rightAppBarIconElement={
            <IconButton onClick={this.showPopover.bind(this, 'settings')}>
              <FontIcon className="fa fa-cog"
                color={emcTheme.rawTheme.palette.alternateTextColor}
                hoverColor={emcTheme.rawTheme.palette.textColor}/>
            </IconButton>
          }
          {...this.props} />
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
    this.forceUpdate();
  }

  showPopover(key, e) {
    if (this.state.activePopover === key) { key = ''; }
    this.setState({
      activePopover: key,
      anchorElement: e.currentTarget
    });
  }

  closePopover(key) {
    if (this.state.activePopover !== key) { return; }
    this.setState({activePopover: 'none'});
  }

}
