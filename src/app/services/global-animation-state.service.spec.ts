import { TestBed, inject } from '@angular/core/testing';

import { GlobalAnimationStateService } from './global-animation-state.service';

describe('GlobalAnimationStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalAnimationStateService]
    });
  });

  it('should be created', inject([GlobalAnimationStateService], (service: GlobalAnimationStateService) => {
    expect(service).toBeTruthy();
  }));
});
