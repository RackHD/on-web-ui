'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component } from 'react';

import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

import {
  } from 'material-ui';

import GraphCanvas, {
    GCGroup,
    GCLink,
    GCNode,
    GCPort,
    GCSocket
  } from 'graph-canvas-web-ui/views/GraphCanvas';

@radium
@decorate({
  propTypes: {},
  defaultProps: {}
})
export default class WELayout extends Component {

  componentWillMount() {}

  componentDidMount() {
    this.updateCanvasSize();
    setTimeout(this.updateCanvasSize.bind(this), 1000);
    var resizeTimer = null;
    this.handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(this.updateCanvasSize.bind(this), 300);
    };
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
    document.body.classList.add('no-select');
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    this.handleResize = null;
    document.body.classList.remove('no-select');
  }

  render() {
    return (
      <div ref="root">
        <GraphCanvas
            ref="graphCanvas"
            initialScale={1}
            viewWidth={this.state.canvasWidth}
            viewHeight={this.state.canvasHeight}
            worldWidth={1500}
            worldHeight={1000}>
          <GCGroup
              initialBounds={[250, 250, 1250, 750]}
              initialColor="darkblue"
              initialName="abc">
            <GCNode
                initialBounds={[50, 50, 250, 250]}
                initialColor="#222"
                initialName="a">
              <GCPort
                  initialColor="darkred"
                  initialName="options">
                <GCSocket
                    dir={[1, 0]}
                    initialColor="pink"
                    initialId="out1"
                    initialName="out" />
              </GCPort>
            </GCNode>
            <GCNode
                initialBounds={[300, 50, 500, 250]}
                initialColor="#666"
                initialName="b">
              <GCPort
                  initialColor="darkgreen"
                  initialName="options">
                <GCSocket
                    dir={[-1, 0]}
                    initialColor="lightgreen"
                    initialId="in1"
                    initialName="in" />
                <GCSocket
                    dir={[1, 0]}
                    initialColor="lightgreen"
                    initialId="out2"
                    initialName="out" />
              </GCPort>
            </GCNode>
            <GCNode
                initialBounds={[550, 50, 750, 250]}
                initialColor="#aaa"
                initialName="c">
              <GCPort
                  initialColor="blue"
                  initialName="options">
                <GCSocket
                    dir={[-1, 0]}
                    initialColor="lightblue"
                    initialId="in2"
                    initialName="In" />
              </GCPort>
            </GCNode>
            <GCLink
                from="out1"
                to="in1" />
            <GCLink
                from="out2"
                to="in2" />
          </GCGroup>
        </GraphCanvas>
      </div>
    );
  }

  updateCanvasSize() {
    var canvasWidth = window.innerWidth - 0,
        canvasHeight = window.innerHeight - 50;
    if (this.state.canvasWidth !== canvasWidth) { this.setState({ canvasWidth }); }
    if (this.state.canvasHeight !== canvasHeight) { this.setState({ canvasHeight }); }
  }

}
