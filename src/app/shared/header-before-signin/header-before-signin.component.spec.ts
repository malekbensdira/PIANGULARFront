import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBeforeSigninComponent } from './header-before-signin.component';

describe('HeaderBeforeSigninComponent', () => {
  let component: HeaderBeforeSigninComponent;
  let fixture: ComponentFixture<HeaderBeforeSigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderBeforeSigninComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderBeforeSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
