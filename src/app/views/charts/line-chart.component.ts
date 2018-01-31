import { Component, OnInit, OnChanges, SimpleChanges, Input, ElementRef, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
  selector: 'app-chart-line-chart',
  template: `<div></div>`,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./line-chart.component.scss']
})

export class LineChartComponent implements OnInit {
  element: ElementRef;
  @Input() lineChartWidth;
  @Input() lineChartHeight = 160;
  @Input() lineChartData: LineChartData[];
  @Input() lineChartTexts = ['Days', 'Percent'];

  constructor(element: ElementRef) {
    this.element = element.nativeElement;
  }

  ngOnInit() {
    this.drawLineChart();
  }

  ngOnChanges(changes: SimpleChanges){
    if (this.findChange(changes.lineChartWidth) ||
      this.findChange(changes.lineChartHeight) ||
      this.findChange(changes.lineChartData) ||
      this.findChange(changes.lineChartTexts)
    ){
      this.reDrawLineChart();
    }
  }

  findChange(obj:any){
    if (!obj || _.isEqual(obj.previousValue, obj.currentValue)){
      return false;
    }
    return true;
  }

  reDrawLineChart(){
    this.drawLineChart();
  }

  drawLineChart(){
    let elRef = d3.select(this.element);
    let data = _.sortBy(this.lineChartData, function(item) {
      return item.x;
    });
    let texts = this.lineChartTexts;

    // margin is necessary for displaying the axis and labels
    let margin = {top: 6, right: 6, bottom: 30, left: 42}
      , width
      , height = this.lineChartHeight - margin.top - margin.bottom;
    if (this.lineChartWidth){
      width = this.lineChartWidth - margin.left - margin.right
    }

    // drawing!
    draw(width, height);

    // resize when window width changes
    d3.select(window).on('resize', resize);
    function resize() {
      // re-calculate width/height
      let chart = elRef.select('svg');
      let width = parseInt(chart.style("width")) - margin.left - margin.right;
      let height = parseInt(chart.style("height")) - margin.top - margin.bottom;
      draw(width, height);
    }

      /**
       * The svg layers are appended one by one, a solid layer will cover the
       * previous layer, so the append order is important!
       */
     function draw(width: number, height: number){
      // clean current chart before drawing a new one
      elRef.select('svg').remove();

      // create init svg
      let svg = elRef.append('svg')
          .attr('width', "100%")
          .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // no init width, then width = 100%
      if(!width){
        width = parseInt(elRef.select('svg').style("width")) - margin.left - margin.right;
      }

      // scale functions for uniform data
      let xScale = d3.scaleLinear()
          .domain([0, _.maxBy(data, (o) => o.x ).x])
          .range([0, width]);

      let yScale = d3.scaleLinear()
          .domain([0, _.maxBy(data, (o) => o.y ).y])
          .range([height, 0]);

      // define line shape
      let line = d3.line()
          .x(function(d) { return xScale(d.x); })
          .y(function(d) { return yScale(d.y); })

      // 1st add gradient chart area;
      createGradients(svg.append('defs'))
      let area = d3.area()
          .x(function(d) { return xScale(d.x); })
          .y0(height)
          .y1(function(d) { return yScale(d.y); });
      svg.append("path")
         .data([data])
         .attr("class", "area")
         .attr("d", area)
         .attr('fill', "url(#line-chart-gradient)");

      // 2nd add grid
      svg.append('g')
          .attr('class', 'grid')
          .call(
              d3.axisLeft(yScale)
              .ticks(5)
              .tickSize(-width)
          );

      // 3rd add x axis
      svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(
            d3.axisBottom(xScale)
            .tickFormat('')
          );


      // 4th add line chart
      svg.append('path')
          .datum(data)
          .attr('class', 'line')
          .attr('d', line);

      svg.selectAll('.dot')
          .data(data)
        .enter().append('circle')
          .attr('class', 'dot')
          .attr('cx', function(d) { return xScale(d.x) })
          .attr('cy', function(d) { return yScale(d.y) });

      // 5th add label
      svg.append('text')
        .attr('class', 'label')
        .attr('transform',
              'translate(' + (width/2) + ' ,' +
                             (height + margin.top + 20) + ')')
        .style('text-anchor', 'middle')
        .text(texts[0]);

      svg.append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x',0 - (height / 2))
        .attr('dy', '0.8em')
        .style('text-anchor', 'middle')
        .text(texts[1]);
     }

    // helper for create linearGradient defs
    function createGradients(defs) {
      let gradient = defs.append("linearGradient")
        .attr("id", "line-chart-gradient")
        .attr('x1', '0')
        .attr('x2', '0')
        .attr('y1', '0')
        .attr('y2', '1');

      gradient.append("stop").attr("offset", "0%").attr("stop-color", 'lightblue');
      gradient.append("stop").attr("offset", "100%")
        .attr("stop-color", "white")
        .attr("stop-opacity", 1);
    }

  }

}

class LineChartData {
  x: number;
  y: number;
}
