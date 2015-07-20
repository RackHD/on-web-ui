'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component } from 'react';

import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

import {
  } from 'material-ui';

import GraphCanvas, {
    GCGroup,
    // GCLink,
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
    // debugger;
    /*
    <GCNode
        name="b">
      <GCPort
          name="options"
          color="green">
        <GCSocket
            name="in"
            dir={[-1, 0]} />
        <GCSocket
            name="out"
            dir={[1, 0]} />
      </GCPort>
    </GCNode>
    <GCNode
        name="c">
      <GCPort
          name="options"
          color="blue">
        <GCSocket
            name="in"
            dir={[-1, 0]} />
      </GCPort>
    </GCNode>
    <GCLink
        from="a.options.out"
        to="b.options.in" />
    <GCLink
        from="b.options.out"
        to="c.options.in" />
    */
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
              initialColor="grey"
              initialName="abc">
            <GCNode
                initialBounds={[100, 100, 300, 300]}
                initialColor="#444"
                initialName="a">
              <GCPort
                  initialBounds={[100, 100, 300, 300]}
                  initialColor="red"
                  initialName="options">
                <GCSocket
                    dir={[1, 0]}
                    initialColor="red"
                    initialName="out" />
              </GCPort>
            </GCNode>
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
