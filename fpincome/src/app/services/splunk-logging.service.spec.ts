import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SplunkLoggingService } from './splunk-logging.service';

describe('SplunkLoggingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [SplunkLoggingService],
    });
  });

  it('should be created ', inject(
    [SplunkLoggingService],
    (service: SplunkLoggingService) => {
      expect(service).toBeTruthy();
    }
  ));
});
