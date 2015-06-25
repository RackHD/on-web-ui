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
import GraphCanvas from './views/GraphCanvas';
import GraphCanvasGrid from './views/GraphCanvas/Grid';
import GraphCanvasLink from './views/GraphCanvas/Link';
import GraphCanvasNode from './views/GraphCanvas/Node';
import GraphCanvasPort from './views/GraphCanvas/Port';
import GraphCanvasSocket from './views/GraphCanvas/Socket';
import GraphCanvasWorld from './views/GraphCanvas/World';
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
  GraphCanvas,
  GraphCanvasGrid,
  GraphCanvasLink,
  GraphCanvasNode,
  GraphCanvasPort,
  GraphCanvasSocket,
  GraphCanvasWorld,
  JsonEditor,
  NotFound,
  TestWrapper,
  UserLogin,
  ViewportSize
};

import decorate from './lib/decorate';
import emcColors from './lib/emcColors';
import featureFlag from './lib/featureFlag';
import Graph from './lib/Graph';
import GraphLink from './lib/Graph/Link';
import GraphId from './lib/Graph/newId';
import GraphNode from './lib/Graph/Node';
import GraphPort from './lib/Graph/Port';
import GraphSocket from './lib/Graph/Socket';
import Matrix from './lib/Matrix';
import Messenger from './lib/Messenger';
import onReady from './lib/onReady';
import Rectangle from './lib/Rectangle';
import Store from './lib/Store';
import Vector from './lib/Vector';

var lib = {
  decorate,
  emcColors,
  featureFlag,
  Graph,
  GraphLink,
  GraphId,
  GraphNode,
  GraphPort,
  GraphSocket,
  Matrix,
  Messenger,
  onReady,
  Rectangle,
  Store,
  Vector
};

import CoordinateHelpers from './mixins/CoordinateHelpers';
import DeveloperHelpers from './mixins/DeveloperHelpers';
import DialogHelpers from './mixins/DialogHelpers';
import DragEventHelpers from './mixins/DragEventHelpers';
import EditorHelpers from './mixins/EditorHelpers';
import FormatHelpers from './mixins/FormatHelpers';
import GridHelpers from './mixins/GridHelpers';
import MUIContextHelpers from './mixins/MUIContextHelpers';
import MUIStyleHelpers from './mixins/MUIStyleHelpers';
import PageHelpers from './mixins/PageHelpers';
import RouteHelpers from './mixins/RouteHelpers';
import ViewportHelpers from './mixins/ViewportHelpers';

var mixins = {
  CoordinateHelpers,
  DeveloperHelpers,
  DialogHelpers,
  DragEventHelpers,
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
global.React = window.React = React;

// Expose to the global namespace.
global.OnWebUI = window.OnWebUI = OnWebUI;

reactTapEventPlugin();

export default OnWebUI;
