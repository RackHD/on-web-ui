'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { RouteHandler } from 'react-router';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';

import { AppCanvas, AppBar } from 'material-ui';

import ActionTypes from '../../constants/ActionTypes';
import Dispatcher from '../../core/Dispatcher';

// import LeftNav from './LeftNav';
import Nodes from '../Nodes';
import Workflows from '../Workflows';

import './App.less';

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
    var resizeTimer = null;
    this.handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(this.updateViewport.bind(this), 300);
    };
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

  onLeftIconButtonTouchTap() {
    this.refs.leftNav.toggle();
  }

  render() {
    var viewport = this.state && this.state.viewport || {},
        title = 'OnRack Web UI';
    var rightElement = (
      <img src={require('./logo-small.png')}
           style={{float: 'right'}}
           width="38"
           height="38"
           alt="React" />
    );
    return (
      <div className="App">
        <AppCanvas predefinedLayout={1}>

          <AppBar className="mui-dark-theme"
                  onLeftIconButtonTouchTap={this.onLeftIconButtonTouchTap}
                  title={title}
                  zDepth={0}
                  iconElementRight={rightElement}
                  />

          <br/><br/><br/><br/>

          {/*<LeftNav ref="leftNav" />*/}

          {/*<RouteHandler />*/}

          <Nodes />
          <Workflows />

          <div className="footer full-width-section mui-dark-theme">
            <div>
              <span>© EMC</span>
              <span style={{float: 'right'}}>{'Viewport: ' + viewport.width + 'x' + viewport.height}</span>
            </div>
          </div>

       </AppCanvas>
      </div>
    );
  }

}

export default App;
