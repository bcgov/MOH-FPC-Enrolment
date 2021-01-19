import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SplashPageService } from './splash-page.service';

describe('SplashPageService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    })
  );

  it('should be created', () => {
    const service: SplashPageService = TestBed.get(SplashPageService);
    expect(service).toBeTruthy();
  });
});
