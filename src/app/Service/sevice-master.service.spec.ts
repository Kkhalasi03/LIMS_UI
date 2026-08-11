import { TestBed } from '@angular/core/testing';

import { SeviceMasterService } from './sevice-master.service';

describe('SeviceMasterService', () => {
  let service: SeviceMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeviceMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
