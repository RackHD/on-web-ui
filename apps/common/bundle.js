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
import AppContainer from './views/AppContainer';
import AppFooter from './views/AppFooter';
import AppHeader from './views/AppHeader';
import AppNavigation from './views/AppNavigation';
import Breadcrumbs from './views/Breadcrumbs';
import Console from './views/Console';
import DataTable from './views/DataTable';
import DataTableToolbar from './views/DataTableToolbar';
import EMCTab from './views/EMCTab';
import EntityGrid from './views/EntityGrid';
import ErrorNotification from './views/ErrorNotification';
import JsonEditor from './views/JsonEditor';
import NotFound from './views/NotFound';
import TestWrapper from './views/TestWrapper';
import UserLogin from './views/UserLogin';
import ViewportSize from './views/ViewportSize';

var views = {
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
import Messenger from './lib/Messenger';
import onReady from './lib/onReady';
import Store from './lib/Store';

var lib = {
  decorate,
  emcColors,
  featureFlag,
  Messenger,
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
import ViewportHelpers from './mixins/ViewportHelpers';

var mixins = {
  DeveloperHelpers,
  DialogHelpers,
  EditorHelpers,
  FormatHelpers,
  GridHelpers,
  MUIContextHelpers,
  MUIStyleHelpers,
  PageHelpers,
  RouteHelpers,
  ViewportHelpers
};

var OnWebUI = {
  vendor,
  views,
  lib,
  mixins
};

// Compiled JSX needs React in the global namespace.
global.React = global.React || React;

// Expose to the global namespace.
global.OnWebUI = OnWebUI;

reactTapEventPlugin();

export default OnWebUI;
