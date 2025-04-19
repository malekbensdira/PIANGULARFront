import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateeventComponent } from './updateevent.component';

describe('UpdateeventComponent', () => {
  let component: UpdateeventComponent;
  let fixture: ComponentFixture<UpdateeventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateeventComponent]
    });
    fixture = TestBed.createComponent(UpdateeventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
