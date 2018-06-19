import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowViewerComponent } from './workflow-viewer.component';

describe('WorkflowViewerComponent', () => {
  let component: WorkflowViewerComponent;
  let fixture: ComponentFixture<WorkflowViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
