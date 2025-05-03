import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAfterSigninComponent } from './header-after-signin.component';

describe('HeaderAfterSigninComponent', () => {
  let component: HeaderAfterSigninComponent;
  let fixture: ComponentFixture<HeaderAfterSigninComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderAfterSigninComponent]
    });
    fixture = TestBed.createComponent(HeaderAfterSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
