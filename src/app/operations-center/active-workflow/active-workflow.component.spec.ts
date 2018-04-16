import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveWorkflowComponent } from './active-workflow.component';

describe('ActiveWorkflowComponent', () => {
  let component: ActiveWorkflowComponent;
  let fixture: ComponentFixture<ActiveWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
