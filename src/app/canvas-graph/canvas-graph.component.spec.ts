import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasGraphComponent } from './canvas-graph.component';

describe('CanvasGraphComponent', () => {
  let component: CanvasGraphComponent;
  let fixture: ComponentFixture<CanvasGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
