import { TestBed } from '@angular/core/testing';

import { BackgammonService } from './backgammon.service';

describe('BackgammonService', () => {
  let service: BackgammonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgammonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
