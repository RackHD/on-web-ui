'use strict';

import 'babel/polyfill';

// Vendor dependencies
import MaterialUI from 'material-ui';
import moment from 'moment';
import React from 'react';
import reactRouter from 'react-router';
import reactMixin from 'react-mixin';
import reactTapEventPlugin from 'react-tap-event-plugin';

// Compiled JSX needs React in the global namespace.
global.React = window.React = React;

var vendor = {
  MaterialUI,
  moment,
  React,
  reactRouter,
  reactMixin,
  reactTapEventPlugin
};

// Local dependencies
var actions = {};

var api = {};

import AppContainer from './components/AppContainer';
import AppFooter from './components/AppFooter';
import AppHeader from './components/AppHeader';
import AppNavigation from './components/AppNavigation';
import Breadcrumbs from './components/Breadcrumbs';
import Console from './components/Console';
import DataTable from './components/DataTable';
import DataTableToolbar from './components/DataTableToolbar';
import EMCTab from './components/EMCTab';
import EntityGrid from './components/EntityGrid';
import ErrorNotification from './components/ErrorNotification';
import JsonEditor from './components/JsonEditor';
import NotFound from './components/NotFound';
import TestWrapper from './components/TestWrapper';
import UserLogin from './components/UserLogin';
import ViewportSize from './components/ViewportSize';

var components = {
  AppContainer,
  AppFooter,
  AppHeader,
  AppNavigation,
  Breadcrumbs,
  Console,
  DataTable,
  DataTableToolbar,
  EMCTab,
  EntityGrid,
  ErrorNotification,
  JsonEditor,
  NotFound,
  TestWrapper,
  UserLogin,
  ViewportSize
};

import decorate from './lib/decorate';
import emcColors from './lib/emcColors';
import featureFlag from './lib/featureFlag';
import onReady from './lib/onReady';
import Store from './lib/Store';

var lib = {
  decorate,
  emcColors,
  featureFlag,
  onReady,
  Store
};

import DeveloperHelpers from './mixins/DeveloperHelpers';
import DialogHelpers from './mixins/DialogHelpers';
import EditorHelpers from './mixins/EditorHelpers';
import FormatHelpers from './mixins/FormatHelpers';
import GridHelpers from './mixins/GridHelpers';
import MUIContextHelpers from './mixins/MUIContextHelpers';
import MUIStyleHelpers from './mixins/MUIStyleHelpers';
import PageHelpers from './mixins/PageHelpers';
import RouteHelpers from './mixins/RouteHelpers';

var mixins = {
  DeveloperHelpers,
  DialogHelpers,
  EditorHelpers,
  FormatHelpers,
  GridHelpers,
  MUIContextHelpers,
  MUIStyleHelpers,
  PageHelpers,
  RouteHelpers
};

var stores = {};

var OnWebUI = {
  vendor,
  actions,
  api,
  components,
  lib,
  mixins,
  stores
};

// Expose to the global namespace.
global.OnWebUI = window.OnWebUI = OnWebUI;

export default OnWebUI;

reactTapEventPlugin();
