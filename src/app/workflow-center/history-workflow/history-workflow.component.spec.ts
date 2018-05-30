import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryWorkflowComponent } from './history-workflow.component';

describe('HistoryWorkflowComponent', () => {
  let component: HistoryWorkflowComponent;
  let fixture: ComponentFixture<HistoryWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
