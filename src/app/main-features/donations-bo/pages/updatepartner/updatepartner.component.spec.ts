import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatepartnerComponent } from './updatepartner.component';

describe('UpdatepartnerComponent', () => {
  let component: UpdatepartnerComponent;
  let fixture: ComponentFixture<UpdatepartnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatepartnerComponent]
    });
    fixture = TestBed.createComponent(UpdatepartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
