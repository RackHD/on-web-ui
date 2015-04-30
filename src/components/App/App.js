'use strict';

import './App.less';
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { canUseDOM } from 'react/lib/ExecutionEnvironment';

import ActionTypes from '../../constants/ActionTypes';
import Dispatcher from '../../core/Dispatcher';

import Footer from '../Footer';
import Navbar from '../Navbar';
import Nodes from '../Nodes';
import Workflows from '../Workflows';

import { RaisedButton, Toolbar, ToolbarGroup, FontIcon, DropDownIcon, DropDownMenu } from 'material-ui';

class App extends Component {
  state = {
    // Default size for server-side rendering
    viewport: {width: 1366, height: 768}
  }

  updateViewport() {
    if (!canUseDOM) { return; }
    let viewport = {width: window.innerWidth, height: window.innerHeight};
    if (this.state.viewport.width !== viewport.width ||
      this.state.viewport.height !== viewport.height) {
      this.setState({viewport: viewport});
    }
  }

  componentDidMount() {
    this.updateViewport();
    this.handleResize = this.updateViewport.bind(this);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);

    this.updatePage = (payload) => {
      if (payload.action.actionType === ActionTypes.CHANGE_LOCATION) {
        // TODO:
        this.setState(payload);
      }
    };
    this.pageDispatcher = Dispatcher.register(this.updatePage);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    this.handleResize = null;
    Dispatcher.unregister(this.pageDispatcher);
  }

  render() {
    var viewport = this.state && this.state.viewport || {};

    var filterOptions = [
      { payload: '1', text: 'All Broadcasts' },
      { payload: '2', text: 'All Voice' },
      { payload: '3', text: 'All Text' },
      { payload: '4', text: 'Complete Voice' },
      { payload: '5', text: 'Complete Text' },
      { payload: '6', text: 'Active Voice' },
      { payload: '7', text: 'Active Text' }
      ];
    var iconMenuItems = [
      { payload: '1', text: 'Download' },
      { payload: '2', text: 'More Info' }
    ];
    return (
      <div className="App">
        <Navbar />

        // TODO: remove example material ui code
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <DropDownMenu menuItems={filterOptions} />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <FontIcon className="fa fa-pie-chart" />
            <FontIcon className="fa fa-sort" />
            <DropDownIcon iconClassName="fa fa-angle-down" menuItems={iconMenuItems} />
            <span className="mui-toolbar-separator">&nbsp;</span>
            <RaisedButton label="Create Broadcast" primary={true} />
          </ToolbarGroup>
        </Toolbar>
        <RaisedButton label="Default" />

        <Nodes />
        <Workflows />
        <Footer>
          <span>{'Viewport: ' + viewport.width + 'x' + viewport.height}</span>
        </Footer>
      </div>
    );
  }

}

export default App;
