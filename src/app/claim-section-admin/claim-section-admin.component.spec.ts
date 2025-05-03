import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimSectionAdminComponent } from './claim-section-admin.component';

describe('ClaimSectionAdminComponent', () => {
  let component: ClaimSectionAdminComponent;
  let fixture: ComponentFixture<ClaimSectionAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimSectionAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSectionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
