import { TestBed } from '@angular/core/testing';

import { IncomeReviewDataService } from './income-review-data.service';

describe('IncomeReviewDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncomeReviewDataService = TestBed.get(
      IncomeReviewDataService
    );
    expect(service).toBeTruthy();
  });
});
