import { TestBed, inject } from '@angular/core/testing';

import { SpaEnvService, SpaEnvResponse } from './spa-env.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { environment } from 'environments/environment';

describe('SpaEnvService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [SpaEnvService]
    });
  });

  it('should be created', inject([SpaEnvService], (service: SpaEnvService) => {
    expect(service).toBeTruthy();
  }));

  it('should POST to the env server on creation and emit the response on values', () => {
    const service = TestBed.inject(SpaEnvService);
    const httpMock = TestBed.inject(HttpTestingController);
    const emitted: SpaEnvResponse[] = [];
    service.values.subscribe(v => emitted.push(v));

    const req = httpMock.expectOne(environment.envServerUrl);
    expect(req.request.method).toBe('POST');

    const body: SpaEnvResponse = {
      SPA_ENV_FPC_MAINTENANCE_FLAG: 'true',
      SPA_ENV_FPC_MAINTENANCE_START: '2024-01-01 01:00:00 AM',
      SPA_ENV_FPC_MAINTENANCE_END: '2024-01-02 01:00:00 AM',
      SPA_ENV_FPC_MAINTENANCE_MESSAGE: 'unit test message',
      SPA_ENV_FPC_ENABLE_ADDRESS_VALIDATOR: 'false',
    };
    req.flush(body);

    expect(emitted).toEqual([body]);
    expect(service.getValues()).toEqual(body);
    httpMock.verify();
  });
});
