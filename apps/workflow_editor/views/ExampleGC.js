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
export default class WEExampleGC extends Component {

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
              key="group-1"
              initialBounds={[250, 250, 1250, 750]}
              initialColor="darkblue"
              initialName="abc">
            <GCNode
                key="node-a"
                initialBounds={[50, 50, 250, 250]}
                initialColor="#222"
                initialName="a">
              <GCPort
                  key="port-options-a"
                  initialColor="darkred"
                  initialName="options">
                <GCSocket
                    key="socket-options-a-out"
                    dir={[1, 0]}
                    initialColor="pink"
                    initialId="out1"
                    initialName="out" />
              </GCPort>
              <GCPort
                  key="port-control-a"
                  initialColor="yellow"
                  initialName="control">
                <GCSocket
                    key="socket-control-a-out"
                    dir={[1, 0]}
                    initialColor="brown"
                    initialName="out" />
              </GCPort>
            </GCNode>
            <GCNode
                key="node-b"
                initialBounds={[300, 50, 500, 250]}
                initialColor="#666"
                initialName="b">
              <GCPort
                  key="port-options-b"
                  initialColor="darkgreen"
                  initialName="options">
                <GCSocket
                    key="socket-options-b-in"
                    dir={[-1, 0]}
                    initialColor="lightgreen"
                    initialId="in1"
                    initialName="in" />
                <GCSocket
                    key="socket-options-b-out"
                    dir={[1, 0]}
                    initialColor="lightgreen"
                    initialId="out2"
                    initialName="out" />
              </GCPort>
              <GCPort
                  key="port-control-a"
                  initialColor="yellow"
                  initialName="control">
                <GCSocket
                    key="socket-control-b-in"
                    dir={[-1, 0]}
                    initialColor="brown"
                    initialName="in" />
                <GCSocket
                    key="socket-control-b-out"
                    dir={[1, 0]}
                    initialColor="brown"
                    initialName="out" />
              </GCPort>
            </GCNode>
            <GCNode
                key="node-c"
                initialBounds={[550, 50, 750, 250]}
                initialColor="#aaa"
                initialName="c">
              <GCPort
                  key="port-control-c"
                  initialColor="yellow"
                  initialName="control">
                <GCSocket
                    key="socket-control-c-in"
                    dir={[-1, 0]}
                    initialColor="brown"
                    initialName="in" />
              </GCPort>
              1
              <br/>
              2
              <br/>
              3
              <br/>
              4
              <br/>
              5
              <br/>
              6
              <br/>
              7
              <br/>
              8
              <br/>
              9
              <br/>
              <GCPort
                  key="port-options-c"
                  initialColor="blue"
                  initialName="options">
                <GCSocket
                    key="socket-options-c-in"
                    dir={[-1, 0]}
                    initialColor="lightblue"
                    initialId="in2"
                    initialName="In" />
              </GCPort>
              10
              <br/>
              11
              <br/>
              12
              <br/>
              13
              <br/>
              14
              <br/>
              15
              <br/>
              16
              <br/>
              17
              <br/>
              18
              <br/>
              19
              <br/>
              20
            </GCNode>
            <GCLink
                key="link-a"
                from="out1"
                to="in1"
                initialColor="cyan" />
            <GCLink
                key="link-b"
                from="out2"
                to="in2"
                initialColor="blue" />
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
