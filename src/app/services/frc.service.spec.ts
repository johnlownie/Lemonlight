import { TestBed } from '@angular/core/testing';

import { FrcService } from './frc.service';

describe('FrcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrcService = TestBed.get(FrcService);
    expect(service).toBeTruthy();
  });
});
