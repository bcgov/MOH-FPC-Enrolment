import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import {
  ContainerService,
  PageStateService,
  CommonLogEvents,
  ApiStatusCodes,
} from 'moh-common-lib';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import {
  FORM_SUBMIT_LABEL,
  INCOME_REVIEW_PAGES,
} from '../../income-review.constants';
import { FormBuilder, Validators } from '@angular/forms';
import { IncomeReviewApiService } from '../../services/income-review-api.service';
import { SplunkLoggingService } from '../../../services/splunk-logging.service';
import { ServerPayload } from '../../models/review-income-api';

@Component({
  selector: 'fpir-consent',
  templateUrl: './consent.component.html',
})
export class ConsentComponent extends BaseForm
  implements OnInit, AfterViewInit {
  /** Focuses the next element to the heading of a new page */
  @ViewChild('heading', { static: true } as any) heading: ElementRef<
    HTMLElement
  >;

  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService,
    private incomeReviewApiService: IncomeReviewApiService,
    private splunkLoggingService: SplunkLoggingService,
    private fb: FormBuilder
  ) {
    super(router, containerService, pageStateService);
  }

  get hasSpouse() {
    return this.incomeReviewDataService.hasSpouse;
  }

  get registrantConsentStmt() {
    return `I, ${
      this.incomeReviewDataService.applicant.name
        ? this.incomeReviewDataService.applicant.name
        : ''
    }, consent`;
  }

  get spouseConsentStmt() {
    return `I, ${
      this.incomeReviewDataService.spouse.name
        ? this.incomeReviewDataService.spouse.name
        : ''
    }, consent`;
  }

  /**
   * NOTE: Work-around until checkbox component is fixed in library, not compatiable with reactive forms
   */
  get isChecked() {
    let _isChecked = !!this.incomeReviewDataService.applicant.consent;

    if (this.hasSpouse) {
      _isChecked = _isChecked && !!this.incomeReviewDataService.spouse.consent;
    }
    return _isChecked;
  }

  get isTouched() {
    let _isTouched = this.formGroup.controls.registrantConsent.touched;
    if (this.hasSpouse) {
      _isTouched = _isTouched && this.formGroup.controls.spouseConsent.touched;
    }
    return _isTouched;
  }

  ngOnInit() {
    // Override BaseForm init method
    this.containerService.setSubmitLabel(FORM_SUBMIT_LABEL);
    this.containerService.setUseDefaultColor(false);

    // Use attribute 'required' rather than setting Valiator.required so that
    // screen readers indentify fields that are required
    this.formGroup = this.fb.group({
      registrantConsent: [
        this.incomeReviewDataService.applicant.consent,
        Validators.required,
      ],
      spouseConsent: [
        this.incomeReviewDataService.spouse.consent,
        {
          validators:
            this.hasSpouse && this.hasSpouse ? Validators.required : null,
        },
      ],
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.heading.nativeElement.focus();
    // subscrib to value changes
    this.formGroup.controls.registrantConsent.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.applicant.consent = val)
    );
    this.formGroup.controls.spouseConsent.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.spouse.consent = val)
    );
  }

  continue() {
    this.markAllInputsTouched();

    /**
     * NOTE: Work-around until checkbox component is fixed in library, not compatiable with reactive forms
     */
    if (this.canContinue() && this.isChecked) {
      this.containerService.setIsLoading(true);
      const jsonPayload = this.incomeReviewDataService.applicationPayload;
      const supportDocuments = this.incomeReviewDataService.getAttachments();

      this.incomeReviewApiService
        .submitApplication(jsonPayload, supportDocuments)
        .then(
          (res: ServerPayload) => {
            this.incomeReviewDataService.applicationResponse = res;

            // Check for negative errors -1 (DB exception), -2 (JSON validation error), -3 (unhandled error)
            const returnCode = Number(res.returnCode);
            if (returnCode < 0) {
              const error =
                returnCode === -1
                  ? 'Database exception'
                  : returnCode === -2
                  ? 'JSON validation exception'
                  : 'Unhandled error';
              this.splunkLoggingService.log({
                event: CommonLogEvents.submission,
                request: 'Income Review Application - Error',
                message: error,
                response: res,
              });
              this.incomeReviewDataService.applicationResponse.returnCode =
                ApiStatusCodes.ERROR;
            } else {
              this.splunkLoggingService.log({
                event: CommonLogEvents.submission,
                request: 'Income Review Application',
                success:
                  this.incomeReviewDataService.applicationResponse.success ||
                  this.incomeReviewDataService.applicationResponse.warning,
                response: res,
              });
            }

            this.containerService.setIsLoading(false);
            this.navigate(INCOME_REVIEW_PAGES.CONFIRMATION.fullpath);
          },
          (error) => {
            this.containerService.setIsLoading(false);

            this.splunkLoggingService.log({
              event: CommonLogEvents.submission,
              request: 'Income Review Application - failure',
              response: error,
            });
            this.navigate(INCOME_REVIEW_PAGES.CONFIRMATION.fullpath);
          }
        )
        .catch((err: Response | any) => {
          this.containerService.setIsLoading(false);

          this.splunkLoggingService.log({
            event: CommonLogEvents.submission,
            request: 'Income Review Application - failure (catch stmt)',
            response: err,
          });
        });
    }
  }
}
