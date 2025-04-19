import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderAfterSigninComponent } from './header-after-signin.component';

describe('HeaderAfterSigninComponent', () => {
  let component: HeaderAfterSigninComponent;
  let fixture: ComponentFixture<HeaderAfterSigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderAfterSigninComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderAfterSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
