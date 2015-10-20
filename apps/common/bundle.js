// Copyright 2015, EMC, Inc.

'use strict';

import 'babel/polyfill';

// Vendor dependencies
import color from 'color';
// import lodash from 'lodash';
import lodashAssign from 'lodash/object/assign';
import lodashCloneDeep from 'lodash/lang/cloneDeep';
import lodashMerge from 'lodash/object/merge';
import machReact from 'mach-react';
import MaterialUI from 'material-ui';
import moment from 'moment';
import prismjs from 'prismjs';
import React from 'react';
import reactDom from 'react-dom';
import reactJsonInspector from 'react-json-inspector';
import reactRouter from 'react-router';
import reactSelect from 'react-select';
import reactTapEventPlugin from 'react-tap-event-plugin';
import superagent from 'superagent';

reactTapEventPlugin();

const vendor = {
  color,
  // lodash,
  lodashAssign,
  lodashCloneDeep,
  lodashMerge,
  machReact,
  MaterialUI,
  moment,
  prismjs,
  React,
  reactDom,
  reactJsonInspector,
  reactRouter,
  reactSelect,
  reactTapEventPlugin,
  superagent
};

// Local dependencies
import AceEditor from './views/AceEditor';
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
import Flipper from './views/Flipper';
import JsonDiff from './views/JsonDiff';
import JsonEditor from './views/JsonEditor';
import NotFound from './views/NotFound';
import TestWrapper from './views/TestWrapper';
import UserLogin from './views/UserLogin';
import ViewportSize from './views/ViewportSize';

import AlertDialog from './views/dialogs/Alert';
import ConfirmDialog from './views/dialogs/Confirm';
import EditJsonDialog from './views/dialogs/EditJson';
import PromptDialog from './views/dialogs/Prompt';

const dialogs = {
  AlertDialog,
  ConfirmDialog,
  EditJsonDialog,
  PromptDialog
};

const views = {
  dialogs,

  AceEditor,
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
  Flipper,
  JsonDiff,
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
import mixin from './lib/mixin';
import onReady from './lib/onReady';
import RestAPI from './lib/RestAPI';
import Store from './lib/Store';

const lib = {
  decorate,
  emcColors,
  featureFlag,
  Messenger,
  mixin,
  onReady,
  RestAPI,
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

const mixins = {
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

const OnWebUI = {
  vendor,
  views,
  lib,
  mixins
};

// Compiled JSX needs React in the global namespace.
global.React = React;

// Expose to the global namespace.
global.OnWebUI = OnWebUI;

export default OnWebUI;
