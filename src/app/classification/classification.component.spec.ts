import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClassificationComponent } from './classification.component';
import { ServiceService } from '../Service/service.service';

describe('ClassificationComponent', () => {
  let component: ClassificationComponent;
  let fixture: ComponentFixture<ClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClassificationComponent],
      imports: [HttpClientTestingModule],
      providers: [ServiceService]
    }).compileComponents();

    fixture = TestBed.createComponent(ClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});