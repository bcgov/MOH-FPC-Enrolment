import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('personalInfo', { static: true } as any)
  personalInfoRef: ElementRef<HTMLElement>;
  personalInfo: ReviewContainerComponent;
  @ViewChild('income', { static: true } as any) incomeRef: ElementRef<
    HTMLElement
  >;
  income: ReviewContainerComponent;
  @ViewChild('supportDocs', { static: true } as any) supportDocsRef: ElementRef<
    HTMLElement
  >;
  supportDocs: ReviewContainerComponent;
  /** Focuses the next element to the heading of a new page */
  @ViewChild('heading', { static: true } as any) heading: ElementRef<
    HTMLElement
  >;

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

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.heading.nativeElement.focus();
  }

  continue() {
    this.navigate(INCOME_REVIEW_PAGES.CONSENT.fullpath);
  }
}
