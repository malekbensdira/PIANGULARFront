import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSettingsAdminComponent } from './profile-settings-admin.component';

describe('ProfileSettingsAdminComponent', () => {
  let component: ProfileSettingsAdminComponent;
  let fixture: ComponentFixture<ProfileSettingsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSettingsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
