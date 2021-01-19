import { Component, OnInit, ViewChild } from '@angular/core';

import { format } from 'date-fns';
import { Base, ApiStatusCodes, PageStateService } from 'moh-common-lib';

import {
  SUCCESSFUL_CONFIRMATION_MSG,
  ERROR_CONFIRMATION_MSG,
} from '../../income-review.constants';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { ReviewContainerComponent } from '../../component/review-container/review-container.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'fpir-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent extends Base implements OnInit {
  @ViewChild('personalInfo', { static: true })
  personalInfo: ReviewContainerComponent;
  @ViewChild('income', { static: true })
  income: ReviewContainerComponent;
  @ViewChild('supportDocs', { static: true })
  supportDocs: ReviewContainerComponent;

  readonly printView: boolean = true;
  readonly hibc = environment.links.hibc;

  // Default to error state
  displayIcon: ApiStatusCodes = ApiStatusCodes.ERROR;

  pageTitle: string = 'Confirmation Message';

  constructor(
    private pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService
  ) {
    super();
  }

  ngOnInit() {
    if (this.incomeReviewDataService.applicationResponse) {
      this.displayIcon = this.incomeReviewDataService.applicationResponse.returnCode;
    }

    this.pageStateService.clearCompletePages();

    this.personalInfo.reviewObject = this.incomeReviewDataService.getPersonalInformationSection(
      this.printView
    );
    this.income.reviewObject = this.incomeReviewDataService.getIncomeSection(
      this.printView
    );
    this.supportDocs.reviewObject = this.incomeReviewDataService.getSupportDocsSection(
      this.printView
    );
  }

  get isError() {
    return this.displayIcon === ApiStatusCodes.ERROR;
  }

  get confirmationMessage() {
    return this.displayIcon === ApiStatusCodes.SUCCESS
      ? SUCCESSFUL_CONFIRMATION_MSG
      : ERROR_CONFIRMATION_MSG;
  }

  get referenceNumber() {
    return this.incomeReviewDataService.applicationResponse.referenceNumber;
  }

  get submissionDate() {
    const dt = new Date();
    return format(dt, 'MMMM dd, yyyy');
  }

  print(event: Event) {
    window.print();
    event.stopPropagation();
    return false;
  }
}
