import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowCanvasComponent } from './workflow-canvas.component';

describe('WorkflowCanvasComponent', () => {
  let component: WorkflowCanvasComponent;
  let fixture: ComponentFixture<WorkflowCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
