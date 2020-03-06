import { TestBed } from '@angular/core/testing';

import { FrcChatService } from './frc-chat.service';

describe('FrcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrcChatService = TestBed.get(FrcChatService);
    expect(service).toBeTruthy();
  });
});
