import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsCenterComponent } from './operations-center.component';

describe('OperationsCenterComponent', () => {
  let component: OperationsCenterComponent;
  let fixture: ComponentFixture<OperationsCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
