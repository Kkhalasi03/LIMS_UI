import { TestBed } from '@angular/core/testing';

import { TestApprovalService } from './test-approval.service';

describe('TestApprovalService', () => {
  let service: TestApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
