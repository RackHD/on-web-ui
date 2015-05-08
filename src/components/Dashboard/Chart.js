'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import ChartistGraph from 'react-chartist';

export default class Chart extends Component {
  render() {

    function randomData() {
      function randomValue() {
        var value = Math.random() * 10;
        if (Math.random() > 0.5) {
          value = -value;
        }
        return value;
      }
      return [
        randomValue(), randomValue(), randomValue(), randomValue(), randomValue(),
        randomValue(), randomValue(), randomValue(), randomValue(), randomValue()
      ];
    }

    var data = {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
      series: [
        // [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
        randomData()
      ]
    };

    var options = {
      high: 10,
      low: -10,
      axisX: {
        labelInterpolationFnc: function(value, index) {
          return index % 2 === 0 ? value : null;
        }
      }
    };

    var type = 'Bar';

    return (
      <div>
        <ChartistGraph data={data} options={options} type={type} />
      </div>
    );
  }
}
