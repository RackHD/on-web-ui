'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { RouteHandler } from 'react-router';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';
import { AppCanvas, AppBar } from 'material-ui';

import AppMenuNav from './AppMenuNav';
import './App.less';

export default class App extends Component {

  state = {
    // NOTE: Default size for server-side rendering
    viewport: {width: 1366, height: 768}
  }

  _onMenuIconButtonTouchTap = this.onMenuIconButtonTouchTap.bind(this);

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
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    this.handleResize = null;
  }

  onMenuIconButtonTouchTap() {
    this.refs.menuNav.toggle();
  }

  render() {
    var viewport = this.state && this.state.viewport || {},
        title = 'OnRack Web UI';

    var emcTab = (
      <a className="emc-tab right"
         href="http://emc.com">
        <img className="emc-logo"
             src="WhiteLogoLarge.png"
             alt="EMC" />
      </a>
    );

    return (
      <AppCanvas className="App" predefinedLayout={1}>
        <AppBar className="header"
                onMenuIconButtonTouchTap={this._onMenuIconButtonTouchTap}
                title={title}
                zDepth={0}
                iconElementRight={emcTab}
                />

        <AppMenuNav ref="menuNav" />

        <div className="content">
          <RouteHandler />
        </div>

        <div className="footer">
          <div>
            <span>© EMC</span>
            <span style={{float: 'right'}}>{'Viewport: ' + viewport.width + 'x' + viewport.height}</span>
          </div>
        </div>
     </AppCanvas>
    );
  }

}
