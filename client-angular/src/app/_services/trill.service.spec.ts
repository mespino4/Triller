import { TestBed } from '@angular/core/testing';

import { TrillService } from './trill.service';

describe('TrillService', () => {
  let service: TrillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
