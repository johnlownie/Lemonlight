import { TestBed } from '@angular/core/testing';

import { FrcTestService } from './frc-test.service';

describe('FrcTestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrcTestService = TestBed.get(FrcTestService);
    expect(service).toBeTruthy();
  });
});
