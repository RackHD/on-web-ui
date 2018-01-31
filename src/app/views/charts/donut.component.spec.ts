import { TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';

import { APP_BASE_HREF } from '@angular/common';

import { DonutComponent } from './donut.component';
import * as d3 from 'd3';
import * as _ from 'lodash';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

// mock data
// 1 basic data
let basicDonutMockData = {
  width: 150,
  height: 150,
  textColor: '#5CB85C',
  text: 'TestText'
}
// 2 percent donut chart data
let percentDonutMockData = {
  width: 150,
  height: 150,
  percent: 0.5,
  colors: ['#5CB85C', '#E5E5E5'],
  thick: 10
}
// 3 list donut chart data
let listDonutMockData = {
  width: 150,
  height: 150,
  thick: 10,
  padAngle: 0.05,
  dataArray: [1, 2, 3, 4],
  colors: ['red', 'yellow', 'blue', 'grey']
}

// define shell component
@Component({
  selector: 'test-component',
  template: ''
})
class TestComponent {
  basicData = basicDonutMockData;
  perData = percentDonutMockData;
  listData = listDonutMockData;
}

describe('<app-chart-donut>', () => {
  // define testing helper vars
  let fixture: any;
  let ne: any;
  let de: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, DonutComponent ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    });
  });

  describe('basic setup', () => {

    beforeEach(async(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
            <app-chart-donut
                [donutWidth]='basicData.width'
                [donutHeight]='basicData.height'
                [donutTextColor]='basicData.textColor'
                [donutText]='basicData.text'
            >
            </app-chart-donut>`
        }
      }).compileComponents();
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      de = fixture.debugElement;
      ne = de.nativeElement;
    }));

    it('should set the svg width and height', async(() => {
      const svg = ne.querySelector('svg');
      expect(svg.getAttribute('width')).toBe(basicDonutMockData.width.toString());
      expect(svg.getAttribute('height')).toBe(basicDonutMockData.height.toString());
    }));

    it('should show the provided text', () => {
      const svgText = ne.querySelector('text');
      expect(svgText.textContent).toBe(basicDonutMockData.text);
    });

    it('should render text with provided color', () => {
      const svgText = ne.querySelector('text');
      expect(svgText.getAttribute('fill')).toBe(basicDonutMockData.textColor);
    });

  });

  describe('percent chart', () => {

    beforeEach(async(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
            <app-chart-donut
                [donutWidth]='basicData.width'
                [donutHeight]='basicData.height'
                [donutPercent]='perData.percent'
                [donutColors]='perData.colors'
                [donutThick]='perData.thick'
            >
            </app-chart-donut>`
        }
      }).compileComponents();
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      de = fixture.debugElement;
      ne = de.nativeElement;
    }));

    it('should render 2 path elements', async(() => {
      expect(ne.querySelectorAll('path').length).toEqual(2);
    }));

    it('should use provided colors to render path', () => {
      let pathes = ne.querySelectorAll('path');
      expect(pathes[0].attributes['fill'].value).toBe(percentDonutMockData.colors[0]);
      expect(pathes[1].attributes['fill'].value).toBe(percentDonutMockData.colors[1]);
    });

    it('should render the arc with provided percent', () => {
      const radius = Math.min(percentDonutMockData.width, percentDonutMockData.height) / 2;
      const testArc = d3.arc()
        .innerRadius(radius - 0)
        .outerRadius(radius - percentDonutMockData.thick)
        .startAngle(0)
        .endAngle(percentDonutMockData.percent*2*Math.PI);
      const path  = ne.querySelector('path');
      expect(path.getAttribute('d')).toEqual(testArc());
    });

  });

  describe('list donut chart', () => {

    beforeEach(async(() => {
      TestBed.overrideComponent(TestComponent, {
        set: {
          template: `
            <app-chart-donut
                [donutWidth]='listData.width'
                [donutHeight]='listData.height'
                [donutDataArray]='listData.dataArray'
                [donutColors]='listData.colors'
                [donutThick]='listData.thick'
                [donutPadAngle]='listData.padAngle'
            >
            </app-chart-donut>`
        }
      }).compileComponents();
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      de = fixture.debugElement;
      ne = de.nativeElement;
    }));

    it('should render 4 path elements', async(() => {
      expect(ne.querySelectorAll('path').length).toEqual(4);
    }));

    it('should use provided colors to render path', () => {
      let pathes = ne.querySelectorAll('path');
      expect(pathes[0].attributes['fill'].value).toBe(listDonutMockData.colors[0]);
      expect(pathes[1].attributes['fill'].value).toBe(listDonutMockData.colors[1]);
      expect(pathes[2].attributes['fill'].value).toBe(listDonutMockData.colors[2]);
      expect(pathes[3].attributes['fill'].value).toBe(listDonutMockData.colors[3]);
    });

  });
});
