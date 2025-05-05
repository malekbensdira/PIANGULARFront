import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeInsuranceComponent } from './subscribe-insurance.component';

describe('SubscribeInsuranceComponent', () => {
  let component: SubscribeInsuranceComponent;
  let fixture: ComponentFixture<SubscribeInsuranceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscribeInsuranceComponent]
    });
    fixture = TestBed.createComponent(SubscribeInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
