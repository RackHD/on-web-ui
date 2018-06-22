import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowCenterComponent } from './workflow-center.component';

describe('WorkflowCenterComponent', () => {
  let component: WorkflowCenterComponent;
  let fixture: ComponentFixture<WorkflowCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
