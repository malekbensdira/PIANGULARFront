import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PredictClaimComponent } from './predict-claim.component';
import { ServiceService } from '../Service/service.service';

describe('PredictClaimComponent', () => {
  let component: PredictClaimComponent;
  let fixture: ComponentFixture<PredictClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PredictClaimComponent],
      imports: [HttpClientTestingModule],
      providers: [ServiceService]
    }).compileComponents();

    fixture = TestBed.createComponent(PredictClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});