'use strict';

import 'babel/polyfill';

// Vendor dependencies
import MaterialUI from 'material-ui';
import moment from 'moment';
import React from 'react';
import reactRouter from 'react-router';
import reactMixin from 'react-mixin';
import reactTapEventPlugin from 'react-tap-event-plugin';

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

import Breadcrumbs from './components/Breadcrumbs';
import Console from './components/Console';
import DataTable from './components/DataTable';
import DataTableToolbar from './components/DataTableToolbar';
import EntityGrid from './components/EntityGrid';
import ErrorNotification from './components/ErrorNotification';
import JsonEditor from './components/JsonEditor';
import NotFound from './components/NotFound';
import TestWrapper from './components/TestWrapper';
import UserLogin from './components/UserLogin';

var components = {
  Breadcrumbs,
  Console,
  DataTable,
  DataTableToolbar,
  EntityGrid,
  ErrorNotification,
  JsonEditor,
  NotFound,
  TestWrapper,
  UserLogin
};

import decorateComponent from './lib/decorateComponent';
import featureFlag from './lib/featureFlag';
import onReady from './lib/onReady';
import Store from './lib/Store';

var lib = {
  decorateComponent,
  onReady,
  featureFlag,
  Store
};

import DeveloperHelpers from './mixins/DeveloperHelpers';
import DialogHelpers from './mixins/DialogHelpers';
import EditorHelpers from './mixins/EditorHelpers';
import FormatHelpers from './mixins/FormatHelpers';
import GridHelpers from './mixins/GridHelpers';
import PageHelpers from './mixins/PageHelpers';
import RouteHelpers from './mixins/RouteHelpers';
import StyleHelpers from './mixins/StyleHelpers';

var mixins = {
  DeveloperHelpers,
  DialogHelpers,
  EditorHelpers,
  FormatHelpers,
  GridHelpers,
  PageHelpers,
  RouteHelpers,
  StyleHelpers
};

var stores = {};

window.OnWebUI = {
  vendor,
  actions,
  api,
  components,
  lib,
  mixins,
  stores
};

export default window.OnWebUI;

reactTapEventPlugin();
