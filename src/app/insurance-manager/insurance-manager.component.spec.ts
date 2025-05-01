import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { InsuranceManagerComponent } from './insurance-manager.component';
import { ServiceService } from '../Service/service.service';

describe('InsuranceManagerComponent', () => {
  let component: InsuranceManagerComponent;
  let fixture: ComponentFixture<InsuranceManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsuranceManagerComponent],
      imports: [HttpClientTestingModule, FormsModule, NgChartsModule],
      providers: [ServiceService]
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});