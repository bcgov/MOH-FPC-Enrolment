import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { ReviewContainerComponent } from '../../component/review-container/review-container.component';

@Component({
  selector: 'fpir-review',
  templateUrl: './review.component.html',
})
export class ReviewComponent extends BaseForm implements OnInit {
  @ViewChild('personalInfo', { static: true })
  personalInfo: ReviewContainerComponent;
  @ViewChild('income', { static: true })
  income: ReviewContainerComponent;
  @ViewChild('supportDocs', { static: true })
  supportDocs: ReviewContainerComponent;

  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService
  ) {
    super(router, containerService, pageStateService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.personalInfo.reviewObject = this.incomeReviewDataService.getPersonalInformationSection();
    this.income.reviewObject = this.incomeReviewDataService.getIncomeSection();
    this.supportDocs.reviewObject = this.incomeReviewDataService.getSupportDocsSection();
  }

  continue() {
    this.navigate(INCOME_REVIEW_PAGES.CONSENT.fullpath);
  }
}
