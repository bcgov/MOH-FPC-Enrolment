import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SpaEnvApiService } from './spa-env-api.service';

describe('SpaEnvService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    })
  );

  it('should be created', () => {
    const service: SpaEnvApiService = TestBed.get(SpaEnvApiService);
    expect(service).toBeTruthy();
  });
});
