import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Container, ContainerService, PageStateService } from 'moh-common-lib';
import { incomeReviewPageRoutes } from './income-review-pages.route';
import { INCOME_REVIEW_PAGES } from './income-review.constants';

@Component({
  selector: 'fpir-income-review',
  templateUrl: './income-review.component.html',
})
export class IncomeReviewComponent extends Container
  implements AfterViewInit, OnDestroy {
  constructor(
    protected containerService: ContainerService,
    private pageStateService: PageStateService
  ) {
    super(containerService);

    this.setProgressSteps(incomeReviewPageRoutes);
    this.pageStateService.setPages(incomeReviewPageRoutes, INCOME_REVIEW_PAGES);
  }

  ngOnDestroy(): void {
    this.unsubscribeFormBar();
  }

  ngAfterViewInit(): void {
    this.subscribeFormBar();
  }
}
