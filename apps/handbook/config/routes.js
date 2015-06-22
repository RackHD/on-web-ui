'use strict';

import React from 'react';
import Router, { Route, Redirect, NotFoundRoute, DefaultRoute } from 'react-router';
import onReady from 'common-web-ui/lib/onReady';

import NotFound from 'common-web-ui/views/NotFound';
import { MenuItem } from 'material-ui';

export var navigation = [
  { text: 'Home', route: '/' },

  { text: 'Guides', type: MenuItem.Types.SUBHEADER },
  { text: 'Getting Started', route: '/guides/getting_started' },
  { text: 'Tutorial Application', route: '/guides/tutorial_application' },
  { text: 'Testing Tutorial', route: '/guides/testing_tutorial' },
  { text: 'Scaffolding', route: '/guides/scaffolding' },
  { text: 'Material UI', type: MenuItem.Types.LINK,
    payload: 'http://material-ui.com/#/components/appbar' },

  { text: 'Library', type: MenuItem.Types.SUBHEADER },
  { text: 'decorate', route: '/lib/decorate' },
  { text: 'emcColors', route: '/lib/emc_colors' },
  { text: 'featureFlag', route: '/lib/feature_flag' },
  { text: 'Graph', route: '/lib/graph' },
  { text: 'GraphId', route: '/lib/graph_id' },
  { text: 'GraphLink', route: '/lib/graph_link' },
  { text: 'GraphNode', route: '/lib/graph_node' },
  { text: 'GraphPort', route: '/lib/graph_port' },
  { text: 'GraphSocket', route: '/lib/graph_socket' },
  { text: 'Matrix', route: '/lib/matrix' },
  { text: 'Messenger', route: '/lib/messenger' },
  { text: 'onReady', route: '/lib/on_ready' },
  { text: 'Store', route: '/lib/store' },
  { text: 'Vector', route: '/lib/vector' },

  { text: 'Views', type: MenuItem.Types.SUBHEADER },
  { text: 'AppContainer', route: '/views/app_container' },
  { text: 'AppFooter', route: '/views/app_footer' },
  { text: 'AppHeader', route: '/views/app_header' },
  { text: 'AppNavigation', route: '/views/app_navigation' },
  { text: 'Breadcrumbs', route: '/views/breadcrumbs' },
  { text: 'Console', route: '/views/console' },
  { text: 'DataTable', route: '/views/data_table' },
  { text: 'DataTableToolbar', route: '/views/data_table_toolbar' },
  { text: 'EMCTab', route: '/views/emc_tab' },
  { text: 'EntityGrid', route: '/views/entity_grid' },
  { text: 'ErrorNotification', route: '/views/error_notification' },
  { text: 'GraphCanvas', route: '/views/graph_canvas' },
  { text: 'GraphCanvasGrid', route: '/views/graph_canvas_grid' },
  { text: 'GraphCanvasLink', route: '/views/graph_canvas_link' },
  { text: 'GraphCanvasNode', route: '/views/graph_canvas_node' },
  { text: 'GraphCanvasPort', route: '/views/graph_canvas_port' },
  { text: 'GraphCanvasSocket', route: '/views/graph_canvas_socket' },
  { text: 'GraphCanvasWorld', route: '/views/graph_canvas_world' },
  { text: 'JsonEditor', route: '/views/json_editor' },
  { text: 'NotFound', route: '/views/not_found' },
  { text: 'TestWrapper', route: '/views/test_wrapper' },
  { text: 'UserLogin', route: '/views/user_login' },
  { text: 'ViewportSize', route: '/views/viewport_size' },

  { text: 'Mixins', type: MenuItem.Types.SUBHEADER },
  { text: 'CoordinateHelpers', route: '/mixins/coordinate_helpers' },
  { text: 'DeveloperHelpers', route: '/mixins/developer_helpers' },
  { text: 'DialogHelpers', route: '/mixins/dialog_helpers' },
  { text: 'DragEventHelpers', route: '/mixins/drag_event_helpers' },
  { text: 'EditorHelpers', route: '/mixins/editor_helpers' },
  { text: 'FormatHelpers', route: '/mixins/format_helpers' },
  { text: 'GridHelpers', route: '/mixins/grid_helpers' },
  { text: 'MUIContextHelpers', route: '/mixins/mui_context_helpers' },
  { text: 'MUIStyleHelpers', route: '/mixins/mui_style_helpers' },
  { text: 'PageHelpers', route: '/mixins/page_helpers' },
  { text: 'RouteHelpers', route: '/mixins/route_helpers' },
  { text: 'ViewportHelpers', route: '/mixins/viewport_helpers' }
];

import App from '../views/App';

import HomePage from '../views/HomePage';
import GuidesPage from '../views/GuidesPage';
import LibPage from '../views/LibPage';
import MixinsPage from '../views/MixinsPage';
import ViewsPage from '../views/ViewsPage';

import GettingStartedPage from '../views/guides/GettingStartedPage';
import ScaffoldingPage from '../views/guides/ScaffoldingPage';
import TestingTutorialPage from '../views/guides/TestingTutorialPage';
import TutorialApplicationPage from '../views/guides/TutorialApplicationPage';

import DecoratePage from '../views/lib/DecoratePage';
import EMCColorsPage from '../views/lib/EMCColorsPage';
import FeatureFlagPage from '../views/lib/FeatureFlagPage';
import GraphPage from '../views/lib/GraphPage';
import GraphIdPage from '../views/lib/GraphIdPage';
import GraphLinkPage from '../views/lib/GraphLinkPage';
import GraphNodePage from '../views/lib/GraphNodePage';
import GraphPortPage from '../views/lib/GraphPortPage';
import GraphSocketPage from '../views/lib/GraphSocketPage';
import MatrixPage from '../views/lib/MatrixPage';
import MessengerPage from '../views/lib/MessengerPage';
import OnReadyPage from '../views/lib/OnReadyPage';
import StorePage from '../views/lib/StorePage';
import VectorPage from '../views/lib/VectorPage';

import CoordinateHelpersPage from '../views/mixins/CoordinateHelpersPage';
import DeveloperHelpersPage from '../views/mixins/DeveloperHelpersPage';
import DialogHelpersPage from '../views/mixins/DialogHelpersPage';
import DragEventHelpersPage from '../views/mixins/DragEventHelpersPage';
import EditorHelpersPage from '../views/mixins/EditorHelpersPage';
import FormatHelpersPage from '../views/mixins/FormatHelpersPage';
import GridHelpersPage from '../views/mixins/GridHelpersPage';
import MUIContextHelpersPage from '../views/mixins/MUIContextHelpersPage';
import MUIStyleHelpersPage from '../views/mixins/MUIStyleHelpersPage';
import PageHelpersPage from '../views/mixins/PageHelpersPage';
import RouteHelpersPage from '../views/mixins/RouteHelpersPage';
import ViewportHelpersPage from '../views/mixins/ViewportHelpersPage';

import AppContainerPage from '../views/views/AppContainerPage';
import AppFooterPage from '../views/views/AppFooterPage';
import AppHeaderPage from '../views/views/AppHeaderPage';
import AppNavigationPage from '../views/views/AppNavigationPage';
import BreadcrumbsPage from '../views/views/BreadcrumbsPage';
import ConsolePage from '../views/views/ConsolePage';
import DataTablePage from '../views/views/DataTablePage';
import DataTableToolbarPage from '../views/views/DataTableToolbarPage';
import EMCTabPage from '../views/views/EMCTabPage';
import EntityGridPage from '../views/views/EntityGridPage';
import ErrorNotificationPage from '../views/views/ErrorNotificationPage';
import GraphCanvasPage from '../views/views/GraphCanvasPage';
import GraphCanvasGridPage from '../views/views/GraphCanvasGridPage';
import GraphCanvasPortPage from '../views/views/GraphCanvasPortPage';
import GraphCanvasNodePage from '../views/views/GraphCanvasNodePage';
import GraphCanvasLinkPage from '../views/views/GraphCanvasLinkPage';
import GraphCanvasSocketPage from '../views/views/GraphCanvasSocketPage';
import GraphCanvasWorldPage from '../views/views/GraphCanvasWorldPage';
import JsonEditorPage from '../views/views/JsonEditorPage';
import NotFoundPage from '../views/views/NotFoundPage';
import TestWrapperPage from '../views/views/TestWrapperPage';
import UserLoginPage from '../views/views/UserLoginPage';
import ViewportSizePage from '../views/views/ViewportSizePage';

let routes = (
  <Route name="root" path="/" handler={App}>
    <DefaultRoute handler={HomePage} />

    <Route path="/guides" handler={GuidesPage} />
    <Route path="/guides/getting_started" handler={GettingStartedPage} />
    <Route path="/guides/tutorial_application" handler={TutorialApplicationPage} />
    <Route path="/guides/testing_tutorial" handler={TestingTutorialPage} />
    <Route path="/guides/scaffolding" handler={ScaffoldingPage} />

    <Route path="/lib" handler={LibPage} />
    <Route path="/lib/decorate" handler={DecoratePage} />
    <Route path="/lib/emc_colors" handler={EMCColorsPage} />
    <Route path="/lib/feature_flag" handler={FeatureFlagPage} />
    <Route path="/lib/graph" handler={GraphPage} />
    <Route path="/lib/graph_id" handler={GraphIdPage} />
    <Route path="/lib/graph_link" handler={GraphLinkPage} />
    <Route path="/lib/graph_node" handler={GraphNodePage} />
    <Route path="/lib/graph_port" handler={GraphPortPage} />
    <Route path="/lib/graph_socket" handler={GraphSocketPage} />
    <Route path="/lib/matrix" handler={MatrixPage} />
    <Route path="/lib/messenger" handler={MessengerPage} />
    <Route path="/lib/on_ready" handler={OnReadyPage} />
    <Route path="/lib/store" handler={StorePage} />
    <Route path="/lib/vector" handler={VectorPage} />

    <Route path="/views" handler={ViewsPage} />
    <Route path="/views/app_container" handler={AppContainerPage} />
    <Route path="/views/app_footer" handler={AppFooterPage} />
    <Route path="/views/app_header" handler={AppHeaderPage} />
    <Route path="/views/app_navigation" handler={AppNavigationPage} />
    <Route path="/views/breadcrumbs" handler={BreadcrumbsPage} />
    <Route path="/views/console" handler={ConsolePage} />
    <Route path="/views/data_table" handler={DataTablePage} />
    <Route path="/views/data_table_toolbar" handler={DataTableToolbarPage} />
    <Route path="/views/emc_tab" handler={EMCTabPage} />
    <Route path="/views/entity_grid" handler={EntityGridPage} />
    <Route path="/views/error_notification" handler={ErrorNotificationPage} />
    <Route path="/views/graph_canvas" handler={GraphCanvasPage} />
    <Route path="/views/graph_canvas_grid" handler={GraphCanvasGridPage} />
    <Route path="/views/graph_canvas_link" handler={GraphCanvasPortPage} />
    <Route path="/views/graph_canvas_node" handler={GraphCanvasNodePage} />
    <Route path="/views/graph_canvas_port" handler={GraphCanvasLinkPage} />
    <Route path="/views/graph_canvas_socket" handler={GraphCanvasSocketPage} />
    <Route path="/views/graph_canvas_world" handler={GraphCanvasWorldPage} />
    <Route path="/views/json_editor" handler={JsonEditorPage} />
    <Route path="/views/not_found" handler={NotFoundPage} />
    <Route path="/views/test_wrapper" handler={TestWrapperPage} />
    <Route path="/views/user_login" handler={UserLoginPage} />
    <Route path="/views/viewport_size" handler={ViewportSizePage} />

    <Route path="/mixins" handler={MixinsPage} />
    <Route path="/mixins/coordinate_helpers" handler={CoordinateHelpersPage} />
    <Route path="/mixins/developer_helpers" handler={DeveloperHelpersPage} />
    <Route path="/mixins/dialog_helpers" handler={DialogHelpersPage} />
    <Route path="/mixins/drag_event_helpers" handler={DragEventHelpersPage} />
    <Route path="/mixins/editor_helpers" handler={EditorHelpersPage} />
    <Route path="/mixins/format_helpers" handler={FormatHelpersPage} />
    <Route path="/mixins/grid_helpers" handler={GridHelpersPage} />
    <Route path="/mixins/mui_context_helpers" handler={MUIContextHelpersPage} />
    <Route path="/mixins/mui_style_helpers" handler={MUIStyleHelpersPage} />
    <Route path="/mixins/page_helpers" handler={PageHelpersPage} />
    <Route path="/mixins/route_helpers" handler={RouteHelpersPage} />
    <Route path="/mixins/viewport_helpers" handler={ViewportHelpersPage} />

    <NotFoundRoute handler={NotFound} />
    <Redirect from="home" to="/" />
  </Route>
);

let params = {
  routes,
  scrollBehavior: Router.ScrollToTopBehavior
};

// Run the application when both DOM is ready and page content is loaded
onReady(() =>
  Router.create(params).run(
    Handler => React.render(<Handler />, document.body)));
