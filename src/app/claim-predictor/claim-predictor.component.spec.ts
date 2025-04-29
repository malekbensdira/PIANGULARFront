import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimPredictorComponent } from './claim-predictor.component';

describe('ClaimPredictorComponent', () => {
  let component: ClaimPredictorComponent;
  let fixture: ComponentFixture<ClaimPredictorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimPredictorComponent]
    });
    fixture = TestBed.createComponent(ClaimPredictorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
