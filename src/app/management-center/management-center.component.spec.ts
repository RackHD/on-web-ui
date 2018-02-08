import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementCenterComponent } from './management-center.component';

describe('ManagementCenterComponent', () => {
  let component: ManagementCenterComponent;
  let fixture: ComponentFixture<ManagementCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
