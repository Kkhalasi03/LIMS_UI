import { TestBed } from '@angular/core/testing';

import { CountryService } from './countryservice.service';

describe('CountryserviceService', () => {
  let service: CountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
