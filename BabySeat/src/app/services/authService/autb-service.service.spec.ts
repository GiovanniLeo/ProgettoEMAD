import { TestBed } from '@angular/core/testing';

import { AutbServiceService } from './autb-service.service';

describe('AutbServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AutbServiceService = TestBed.get(AutbServiceService);
    expect(service).toBeTruthy();
  });
});
