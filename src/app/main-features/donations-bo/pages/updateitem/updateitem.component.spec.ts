import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateitemComponent } from './updateitem.component';

describe('UpdateitemComponent', () => {
  let component: UpdateitemComponent;
  let fixture: ComponentFixture<UpdateitemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateitemComponent]
    });
    fixture = TestBed.createComponent(UpdateitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
