import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackStatsModalComponent } from './feedback-stats-modal.component';

describe('FeedbackStatsModalComponent', () => {
  let component: FeedbackStatsModalComponent;
  let fixture: ComponentFixture<FeedbackStatsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackStatsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackStatsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
