'use strict';

import { Component } from 'mach-react';

import Vector from '../lib/Vector';
import Rectangle from '../lib/Rectangle';

import GSGridElement from './GridElement';

let nil = null;

export default class GSVectorsLayer extends Component {

  static defaultProps = {
    bounds: null,
    className: 'GSVectorsLayer',
    css: {},
    grid: null,
    style: {}
  }

  get canvas() { return this.context.canvas; }

  state = {
    bounds: this.props.bounds,
    grid: this.props.grid
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      bounds: nextProps.bounds,
      grid: nextProps.grid
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    let state = this.state,
        props = this.props;
    if (!state.bounds && !nextState.bounds) return true;
    return (
      props.children !== nextProps.children ||
      state.bounds !== nextState.bounds ||
      state.grid !== nextState.grid
    );
  }

  render(React) {
    try {
      let props = this.props,
          bounds = this.state.bounds,
          size = this.canvas.worldSize,
          cssSize = this.canvas.cssWorldSize,
          boundingBox = this.canvas.worldBoundingBox,
          grid = null;

      if (this.state.grid) {
        grid = <GSGridElement {...this.state.grid} />;
      }

      if (bounds) {
        size = new Vector(bounds.width, bounds.height);
        cssSize = {width: size.x, height: size.y};
        boundingBox = new Rectangle(0, 0, size.x, size.y);
      }

      return (
        <svg
            svg={true}
            className={props.className}
            width={size.x}
            height={size.y}
            style={[cssSize, {
              overflow: 'visible',
              position: 'absolute',
              left: 0,
              top: 0
            }]}
            viewBox={boundingBox.toSVGViewBox()}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg">
          {grid}
          {props.children}
        </svg>
      );
    }

    catch (err) {
      console.error(err.stack || err);
    }
  }

}
