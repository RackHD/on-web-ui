// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
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
import icons from '../icons';
import { navigation } from '../routes';

export default class App extends Component {

  static childContextTypes = {
    app: PropTypes.any,
    icons: PropTypes.any
  };

  getChildContext() {
    return { app: this, icons };
  }

  state = {
    customTitle: null,
    customMenu: null,
    navigation,
    monorailAPI: this.monorailAPI
  };

  render() {
    return (
      <AppContainer
          key="app"
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
            <Link key={0} to="dashboard" style={{paddingLeft: 4, marginRight: 24, float: 'left', display: 'inline-block'}}>
              <FontIcon className="fa fa-dashboard"
                color={emcTheme.rawTheme.palette.alternateTextColor}
                hoverColor={emcTheme.rawTheme.palette.textColor} />
            </Link>
          ]}
          replaceBreadcrumbs={this.state.customTitle}
          afterBreadcrumbs={this.state.customMenu || [
            <Link key="we" to="workflow_editor" style={{marginLeft: 12, marginTop: -2, float: 'left'}}>
              <IconButton tooltip="Workflow Editor">
                <FontIcon className="fa fa-share-alt"
                  color={emcTheme.rawTheme.palette.alternateTextColor}
                  hoverColor={emcTheme.rawTheme.palette.textColor} />
              </IconButton>
            </Link>,
            <Link key="logs" to="logs" style={{marginRight: 16, marginTop: -2, float: 'right'}}>
              <IconButton tooltip="View Logs">
                <FontIcon className="fa fa-terminal"
                  color={emcTheme.rawTheme.palette.alternateTextColor}
                  hoverColor={emcTheme.rawTheme.palette.textColor} />
              </IconButton>
            </Link>
          ]}
          rightAppBarIconElement={
            <IconButton onClick={this.showPopover.bind(this, 'settings')}>
              <FontIcon className="fa fa-cog"
                color={emcTheme.rawTheme.palette.alternateTextColor}
                hoverColor={emcTheme.rawTheme.palette.textColor} />
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
    window.localStorage.setItem('monorail-config', JSON.stringify(config));
    this.setState({activePopover: null}, () => {
      setTimeout(() => window.location.reload(), 250);
    });
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
    this.setState({activePopover: null});
  }

}
