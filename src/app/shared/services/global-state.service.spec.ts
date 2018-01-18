import { TestBed, inject } from '@angular/core/testing';

import { GlobalStateService } from './global-state.service';

describe('GlobalStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalStateService]
    });
  });

  it('should be created', inject([GlobalStateService], (service: GlobalStateService) => {
    expect(service).toBeTruthy();
  }));
});
