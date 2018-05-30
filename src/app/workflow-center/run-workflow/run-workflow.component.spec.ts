import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunWorkflowComponent } from './run-workflow.component';

describe('RunWorkflowComponent', () => {
  let component: RunWorkflowComponent;
  let fixture: ComponentFixture<RunWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
