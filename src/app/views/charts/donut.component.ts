import { Component, OnInit, OnChanges, SimpleChanges, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
  selector: 'app-chart-donut',
  template: `<div></div>`,
  styleUrls: []
})

export class DonutComponent implements OnInit, OnChanges {
  element: HTMLElement;
  @Input() donutWidth = 130;
  @Input() donutHeight = 130;
  @Input() donutPercent = 0;
  @Input() donutColors = ['#5CB85C', '#E5E5E5'];
  @Input() donutTextColor = '#5CB85C';
  @Input() donutDataArray: number[];
  @Input() donutThick = 6;
  @Input() donutText = 'Complience';
  @Input() donutPadAngle = 0;

  constructor(element: ElementRef) {
    this.element = element.nativeElement;
  }

  ngOnInit(){
    this.drawDonut();
  }

  ngOnChanges(changes: SimpleChanges){
    if (this.findChange(changes.donutWidth) ||
      this.findChange(changes.donutHeight) ||
      this.findChange(changes.donutPercent) ||
      this.findChange(changes.dobutColors) ||
      this.findChange(changes.donutTextColor) ||
      this.findChange(changes.donutDataArray) ||
      this.findChange(changes.donutThick) ||
      this.findChange(changes.donutText) ||
      this.findChange(changes.donutPadAngle)
    ){
      this.reDrawDonut();
    }
  }

  findChange(obj:any){
    if (!obj || _.isEqual(obj.previousValue, obj.currentValue)){
      return false;
    }
    return true;
  }

  reDrawDonut(){
    this.drawDonut();
  }

  drawDonut(){
    // clean current chart before drawing a new one
    d3.select(this.element).select('svg').remove();

    let percent = this.donutPercent,
        dataArray = this.donutDataArray,
        dataset;
    if (dataArray){
      dataset = dataArray;
    } else {
      dataset = [percent, 1-percent];
    }

    let donutColors = this.donutColors;
    let textColor = this.donutTextColor;
    let thick = this.donutThick;
    let text = this.donutText;
    let padAngle = this.donutPadAngle;

    let width = this.donutWidth;
    let height = this.donutHeight;
    let radius = Math.min(width, height) / 2;
    let pie = d3.pie().sort(null).padAngle(padAngle);
    let arc = d3.arc()
        .innerRadius(radius - 0)
        .outerRadius(radius - thick);


    let svg = d3.select(this.element)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate('
            + width / 2 + ','
            + height / 2  + ')');

    let path = svg.selectAll('path')
        .data(pie(dataset))
        .enter().append('path')
        .attr('fill', function(d, i) {
           return donutColors[i] ;
         })
        .attr('d', arc);

    svg.append('svg:text')
        .attr('dy', '2em')
        .attr('text-anchor', 'middle')
        .attr('fill', textColor)
        .text(text);

    svg.append('svg:text')
        .attr('dy', '0.25em')
        .attr('text-anchor', 'middle')
        .attr('font-size','40')
        .attr('fill', textColor)
        .text(
          dataArray
          ?  _.sum(dataArray):
            (100*percent).toFixed(0) + '%'
        );
  }

}
