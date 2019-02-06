import { TestBed } from '@angular/core/testing';

import { AuthService } from './autb-service.service';

describe('AutbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
