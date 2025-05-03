import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoAnimatedComponent } from './logo-animated.component';

describe('LogoAnimatedComponent', () => {
  let component: LogoAnimatedComponent;
  let fixture: ComponentFixture<LogoAnimatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoAnimatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoAnimatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
