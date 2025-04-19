import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetSmsComponent } from './reset-sms.component';

describe('ResetSmsComponent', () => {
  let component: ResetSmsComponent;
  let fixture: ComponentFixture<ResetSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
