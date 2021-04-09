import { TestBed } from '@angular/core/testing';

import { IncomeReviewApiService } from './income-review-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('IncomeReviewApiService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    })
  );

  it('should be created', () => {
    const service: IncomeReviewApiService = TestBed.get(IncomeReviewApiService);
    expect(service).toBeTruthy();
  });
});
