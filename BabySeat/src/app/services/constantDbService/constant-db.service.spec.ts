import { TestBed } from '@angular/core/testing';

import { ConstantDbService } from './constant-db.service';

describe('ConstantDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConstantDbService = TestBed.get(ConstantDbService);
    expect(service).toBeTruthy();
  });
});
