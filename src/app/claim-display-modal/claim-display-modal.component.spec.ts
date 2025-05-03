import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimDisplayModalComponent } from './claim-display-modal.component';

describe('ClaimDisplayModalComponent', () => {
  let component: ClaimDisplayModalComponent;
  let fixture: ComponentFixture<ClaimDisplayModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimDisplayModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimDisplayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
