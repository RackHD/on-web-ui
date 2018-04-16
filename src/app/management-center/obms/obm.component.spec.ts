import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObmComponent } from './obm.component';

describe('ObmComponent', () => {
  let component: ObmComponent;
  let fixture: ComponentFixture<ObmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
