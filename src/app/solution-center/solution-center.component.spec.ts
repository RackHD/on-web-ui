import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionCenterComponent } from './solution-center.component';

describe('SolutionCenterComponent', () => {
  let component: SolutionCenterComponent;
  let fixture: ComponentFixture<SolutionCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolutionCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
