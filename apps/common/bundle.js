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
import GraphCanvas from './components/GraphCanvas';
import GraphCanvasGrid from './components/GraphCanvas/Grid';
import GraphCanvasLink from './components/GraphCanvas/Link';
import GraphCanvasNode from './components/GraphCanvas/Node';
import GraphCanvasPort from './components/GraphCanvas/Port';
import GraphCanvasSocket from './components/GraphCanvas/Socket';
import GraphCanvasWorld from './components/GraphCanvas/World';
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
  components,
  lib,
  mixins
};

// Expose to the global namespace.
global.OnWebUI = window.OnWebUI = OnWebUI;

export default OnWebUI;

reactTapEventPlugin();
