import { TestBed } from '@angular/core/testing';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { IncomeReviewDataService } from './income-review-data.service';

describe('IncomeReviewDataService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideEnvironmentNgxMask()],
    })
  );

  it('should be created', () => {
    const service: IncomeReviewDataService = TestBed.get(
      IncomeReviewDataService
    );
    expect(service).toBeTruthy();
  });
});
