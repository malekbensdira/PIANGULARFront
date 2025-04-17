import { TestBed } from '@angular/core/testing';

import { ImmobilierService } from './immobilier.service';

describe('ImmobilierService', () => {
  let service: ImmobilierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImmobilierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
