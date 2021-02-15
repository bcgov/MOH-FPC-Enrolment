import { Component, OnInit, AfterViewInit } from '@angular/core';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import {
  CommonImage,
  CommonImageError,
  ContainerService,
  PageStateService,
} from 'moh-common-lib';
import {
  FpcDocumentTypes,
  IncomeReviewDataService,
} from '../../services/income-review-data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'fpir-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
})
export class IncomeComponent extends BaseForm implements OnInit, AfterViewInit {
  readonly incomeStmt = environment.links.incomeStmt;
  readonly serviceCanada = environment.links.serviceCanada;
  readonly incomeOptions = [
    { label: `Applying with last year's net income`, value: true },
    { label: `Applying with this year's gross income`, value: false },
  ];

  readonly netIncomeInstruct =
    `<div>Use information from your CRA Notice of Assessment or Notice of Reassessment or ` +
    `<a href="${this.incomeStmt}" target="_blank" rel="noopener noreferrer">proof of income statement</a> ` +
    `for last year.</div>` +
    `<div>Haven't filed your taxes yet? If you are applying after June 1, you must provide your CRA Notice ` +
    `of Assessment. If you are applying before June 1, provide tax slips and other income records.</div>`;

  readonly grossIncomeInstruct =
    '<p><strong>Estimate your gross income for the current calendar year.</strong></p>' +
    '<p>Add up all amounts that you and your spouse have received this year and expect to receive from all sources. ' +
    'This will be your gross income.</p>';

  readonly supportDocSpouseFrag =
    'supporting documents for you and your spouse, ';
  readonly supportDocFrag = 'supporting documents ';
  readonly netIncomeFrag = `for last year's net income`;
  readonly grossIncomeFrag = `for this year's gross income`;

  readonly uploadInstructions =
    'Click add, or drag and drop file into this box';

  incomeLineNumber: number = 1;
  spouseIncomeLineNumber: number = 2;

  updateIncomeTotalValue: boolean = false;
  errorMessage: string = null;

  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService,
    private fb: FormBuilder
  ) {
    super(router, containerService, pageStateService);
  }

  get isLastYearIncome() {
    return this.incomeReviewDataService.isLastYearIncome;
  }

  set isLastYearIncome(lastYearIncome: boolean) {
    this.incomeReviewDataService.isLastYearIncome = lastYearIncome;
  }

  get showSection() {
    return (
      this.incomeReviewDataService.isLastYearIncome !== undefined &&
      this.incomeReviewDataService.isLastYearIncome !== null
    );
  }

  get incomeHeading() {
    return this.incomeReviewDataService.incomeHeading;
  }

  get incomeInstruction() {
    return this.incomeReviewDataService.isLastYearIncome === true
      ? this.netIncomeInstruct
      : this.grossIncomeInstruct;
  }

  get ariaLabelIncome() {
    return this.incomeReviewDataService.isLastYearIncome === true
      ? 'NetIncome'
      : 'GrossIncome';
  }

  get ariaLabelSpouseIncome() {
    return this.incomeReviewDataService.isLastYearIncome === true
      ? 'SpouseNetIncome'
      : 'SpouseGrossIncome';
  }

  get incomeLabel() {
    return this.incomeReviewDataService.incomeLabel();
  }

  get spouseIncomeLabel() {
    return this.incomeReviewDataService.spouseIncomeLabel();
  }

  get incomeTotalLabel() {
    return this.incomeReviewDataService.incomeTotalLabel;
  }

  get rdspIncomeLabel() {
    return this.incomeReviewDataService.rdspIncomeLabel();
  }

  get spouseRdspIncomeLabel() {
    return this.incomeReviewDataService.spouseRdspIncomeLabel();
  }

  get rdspIncomeTotalLabel() {
    return this.incomeReviewDataService.rdspIncomeTotalLabel;
  }

  get netIncomeMinusRdspLabel() {
    return this.incomeReviewDataService.totalNetIncomeLabel;
  }

  get hasSpouse() {
    return this.incomeReviewDataService.hasSpouse;
  }

  get hasRdspIncome() {
    return this.incomeReviewDataService.hasRdspIncome;
  }

  get showSupportDocSection() {
    return (
      (this.isLastYearIncome === true &&
        (this.hasRdspIncome === true || this.hasRdspIncome === false)) ||
      this.isLastYearIncome === false
    );
  }

  get moneyMask() {
    return this.incomeReviewDataService.incomeInputMask;
  }

  get moneyTotalMask() {
    return this.incomeReviewDataService.incomeDisplayMask;
  }

  get incomeTotalLineNo() {
    return (
      this.incomeLineNumber + (this.hasSpouse ? this.spouseIncomeLineNumber : 0)
    );
  }

  get rdspLineNo() {
    return this.incomeTotalLineNo + 1;
  }

  get spouseRdspLineNo() {
    return this.rdspLineNo + 1;
  }

  get totalRspdLineNo() {
    return this.spouseRdspLineNo + 1;
  }

  get netInomeMinusRdspLineNo() {
    return (this.hasSpouse ? this.totalRspdLineNo : this.rdspLineNo) + 1;
  }

  set supportingDocuments(supportDocuments: CommonImage<FpcDocumentTypes>[]) {
    // Set file error to null - hide error container
    this.errorMessage = null;

    // Update document list
    this.incomeReviewDataService.incomeSupportDocs = supportDocuments
      ? supportDocuments
      : [];
  }

  get supportingDocuments() {
    return this.incomeReviewDataService.incomeSupportDocs;
  }

  get netIncomeTipTitle() {
    return (
      (this.hasSpouse ? this.supportDocSpouseFrag : this.supportDocFrag) +
      this.netIncomeFrag
    );
  }

  get grossIncomeTipTitle() {
    return (
      (this.hasSpouse ? this.supportDocSpouseFrag : this.supportDocFrag) +
      this.grossIncomeFrag
    );
  }

  ngOnInit() {
    super.ngOnInit();

    // Use attribute 'required' rather than setting Valiator.required so that
    // screen readers indentify fields that are required
    this.formGroup = this.fb.group({
      isLastYearIncome: [
        this.incomeReviewDataService.isLastYearIncome,
        Validators.required,
      ],
      income: [
        this.incomeReviewDataService.applicant.incomeStr,
        { validators: Validators.required, updateOn: 'blur' },
      ],
      spouseIncome: [
        this.incomeReviewDataService.spouse.incomeStr,
        {
          validators: this.hasSpouse ? Validators.required : null,
          updateOn: 'blur',
        },
      ],
      incomeTotal: [
        {
          value: this.incomeReviewDataService.formatIncomeTotal(
            this.incomeReviewDataService.incomeTotal
          ),
          disabled: true,
        },
      ],
      hasRdspIncome: [
        this.incomeReviewDataService.hasRdspIncome,
        {
          validators: this.isLastYearIncome ? Validators.required : null,
          updateOn: 'blur',
        },
      ],
      rdspIncome: [
        this.incomeReviewDataService.applicant.rdspIncomeStr,
        {
          validators: this.hasRdspIncome ? Validators.required : null,
          updateOn: 'blur',
        },
      ],
      spouseRdspIncome: [
        this.incomeReviewDataService.spouse.rdspIncomeStr,
        {
          validators:
            this.hasSpouse && this.hasRdspIncome ? Validators.required : null,
          updateOn: 'blur',
        },
      ],
      rdspIncomeTotal: [
        {
          value: this.incomeReviewDataService.formatIncomeTotal(
            this.incomeReviewDataService.rdspIncomeTotal
          ),
          disabled: true,
        },
      ],
      netIncomeMinusRdsp: [
        {
          value: this.incomeReviewDataService.formatIncomeTotal(
            this.incomeReviewDataService.netIncomeTotal
          ),
          disabled: true,
        },
      ],
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // subscribe to value changes
    this.formGroup.controls.isLastYearIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.isLastYearIncome = val;
      this.resetIncome();
    });

    this.formGroup.controls.income.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.applicant.incomeStr = val;
      this.updateIncomeTotal();
    });

    this.formGroup.controls.spouseIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.spouse.incomeStr = val;
      this.updateIncomeTotal();
    });

    this.formGroup.controls.hasRdspIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.hasRdspIncome = val;
      this.resetRsdpIncome();

      if (val === true) {
        this.updateIncomeTotal();
      }
    });

    this.formGroup.controls.rdspIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.applicant.rdspIncomeStr = val;
      this.updateIncomeTotal();
    });

    this.formGroup.controls.spouseRdspIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.spouse.rdspIncomeStr = val;
      this.updateIncomeTotal();
    });
  }

  continue() {
    this.markAllInputsTouched();

    // Work around since file uploader is not compatiable with reactive forms
    // and it is not designed as a custom form control
    if (this.incomeReviewDataService.incomeSupportDocs.length < 1) {
      this.errorMessage = 'File is required.';
    }

    if (
      this.canContinue() &&
      this.incomeReviewDataService.incomeSupportDocs.length > 0 &&
      this.errorMessage === null
    ) {
      this.navigate(INCOME_REVIEW_PAGES.REVIEW.fullpath);
    }
  }

  updateIncomeTotal() {
    if (this.hasSpouse) {
      const _income = this.incomeReviewDataService.formatIncomeTotal(
        this.incomeReviewDataService.incomeTotal
      );
      this.formGroup.controls.incomeTotal.setValue(_income);
    }

    // RDSP income
    if (this.isLastYearIncome && this.hasRdspIncome) {
      const _rdspIncome = this.incomeReviewDataService.formatIncomeTotal(
        this.incomeReviewDataService.rdspIncomeTotal
      );
      this.formGroup.controls.rdspIncomeTotal.setValue(_rdspIncome);

      const _netIncome = this.incomeReviewDataService.formatIncomeTotal(
        this.incomeReviewDataService.netIncomeTotal
      );
      this.formGroup.controls.netIncomeMinusRdsp.setValue(_netIncome);
    }
  }

  resetRsdpIncome() {
    const apRsdpIncome = this.formGroup.controls.rdspIncome;
    apRsdpIncome.reset(null);

    this.formGroup.controls.rdspIncomeTotal.reset(null);
    this.formGroup.controls.netIncomeMinusRdsp.reset(null);

    // Set validators
    if (this.hasRdspIncome) {
      apRsdpIncome.setValidators(Validators.required);
    } else {
      apRsdpIncome.clearValidators();
    }

    if (this.hasSpouse) {
      const spRsdpIncome = this.formGroup.controls.spouseRdspIncome;
      spRsdpIncome.reset(null);

      if (this.hasRdspIncome) {
        spRsdpIncome.setValidators(Validators.required);
      } else {
        spRsdpIncome.clearValidators();
      }
    }
  }

  resetIncome() {
    // Reset flags on control
    this.formGroup.controls.income.reset(null);

    if (this.hasSpouse) {
      // Reset flags on control
      this.formGroup.controls.spouseIncome.reset(null);
      this.formGroup.controls.spouseRdspIncome.reset(null);
    }

    // RDSP
    this.formGroup.controls.hasRdspIncome.reset();
    this.resetRsdpIncome();

    // Clear support documents
    this.incomeReviewDataService.incomeSupportDocs = [];
  }

  handleError(error: CommonImage) {
    if (error) {
      // Determine error to display
      switch (error.error) {
        case CommonImageError.WrongType:
          this.errorMessage = 'That is the wrong type of attachment to submit.';
          break;

        case CommonImageError.AlreadyExists:
          this.errorMessage = 'That attachment has already been uploaded.';
          break;

        case CommonImageError.PDFnotSupported:
          this.errorMessage =
            'That PDF type is not supported, please upload a different attachment.';
          break;

        case CommonImageError.CannotOpen:
          this.errorMessage =
            'That attachment cannot be opened, please upload a different attachment.';
          break;

        case CommonImageError.CannotOpenPDF:
          this.errorMessage =
            'That PDF cannot be opened, please upload a different attachment.';
          break;

        case CommonImageError.TooSmall:
          this.errorMessage =
            'That attachment is too small, please upload a larger attachment.';
          break;

        case CommonImageError.TooBig:
          this.errorMessage =
            'That attachment is too big, please upload a smaller attachment.';
          break;

        // Catch all, unknown error
        default:
          this.errorMessage =
            'The upload failed, please try again. If the issue persists, please upload a different attachment.';
          break;
      }
    } else {
      // clear error message
      this.errorMessage = null;
    }
  }
}
