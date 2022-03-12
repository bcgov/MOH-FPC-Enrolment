import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { CollectionNoticeComponent } from '../../component/collection-notice/collection-notice.component';
import { environment } from '../../../../environments/environment';
import { UUID } from 'angular2-uuid';
import { IncomeReviewApiService } from '../../services/income-review-api.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'fpir-home',
  templateUrl: './home.component.html',
})
export class HomeComponent extends BaseForm implements OnInit, AfterViewInit {
  @ViewChild('infoCollectionModal', {})
  infoCollectionModal: CollectionNoticeComponent;

  /** Focuses the next element to the heading of a new page */
  @ViewChild('heading', {}) heading: ElementRef<HTMLInputElement>;

  // Value never changed, but can be read outside class
  readonly captchaApiUrl = environment.api.captchaBaseURL;
  readonly mspSuppBenefits = environment.links.mspSuppBenefits;
  readonly fpcRegistration = environment.links.fpcRegister;
  readonly fpcRegistrationStatus = environment.links.fpcRegStatus;
  readonly successMessage = 'You can proceed to the form now.';

  // Use the UUID as a cryptographic client nonce to avoid replay attacks.
  nonce: string = UUID.UUID();

  // Radio button questions
  isRegisteredQuestion: string = 'Are you registered for Fair PharmaCare?';
  isIncomeLessQuestion: string =
    'Is your gross income for this year or your net income for last year at least 10% less than ' +
    'your income from two years ago?';

  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService,
    private incomeReviewApiService: IncomeReviewApiService,
    private fb: FormBuilder
  ) {
    super(router, containerService, pageStateService);
  }

  get hasConsent() {
    return this.incomeReviewDataService.informationCollectionNoticeConsent;
  }

  get isRegisterError() {
    if (
      this.incomeReviewDataService.isRegistered !== null &&
      this.incomeReviewDataService.isRegistered !== undefined &&
      this.incomeReviewDataService.isRegistered === false
    ) {
      return true;
    }
    return false;
  }

  get isIncomeLessError() {
    if (
      this.incomeReviewDataService.isIncomeLess !== null &&
      this.incomeReviewDataService.isIncomeLess !== undefined &&
      this.incomeReviewDataService.isIncomeLess === false
    ) {
      return true;
    }
    return false;
  }

  ngOnInit() {
    super.ngOnInit();

    this.formGroup = this.fb.group({
      isRegistered: [
        this.incomeReviewDataService.isRegistered,
        Validators.required,
      ],
      isIncomeLess: [
        this.incomeReviewDataService.isIncomeLess,
        Validators.required,
      ],
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // subscribe to value changes
    this.formGroup.controls.isRegistered.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.isRegistered = val)
    );
    this.formGroup.controls.isIncomeLess.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.isIncomeLess = val)
    );

    // Individual has not consented to collection notice
    if (!this.incomeReviewDataService.informationCollectionNoticeConsent) {
      this.infoCollectionModal.openModal();
      this.heading.nativeElement.focus();
    }
  }

  setToken(token: string): void {
    this.incomeReviewApiService.setCaptchaToken(token);
    this.incomeReviewDataService.informationCollectionNoticeConsent = true;
  }

  continue() {
    this.markAllInputsTouched();
    if (
      this.canContinue() &&
      this.incomeReviewDataService.informationCollectionNoticeConsent &&
      !this.isRegisterError &&
      !this.isIncomeLessError
    ) {
      this.navigate(INCOME_REVIEW_PAGES.PERSONAL_INFO.fullpath);
    }
  }

  setFocus() {
    // Set focus to main html tag identified by id=content
    const mainContent = document.getElementById('mainHeading');
    // Headless tests fail if null not checked for
    if (mainContent) {
      mainContent.tabIndex = -1;
      mainContent.focus();
    }
  }
}
