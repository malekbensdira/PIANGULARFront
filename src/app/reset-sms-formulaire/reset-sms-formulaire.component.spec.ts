import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetSmsFormulaireComponent } from './reset-sms-formulaire.component';

describe('ResetSmsFormulaireComponent', () => {
  let component: ResetSmsFormulaireComponent;
  let fixture: ComponentFixture<ResetSmsFormulaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetSmsFormulaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetSmsFormulaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
