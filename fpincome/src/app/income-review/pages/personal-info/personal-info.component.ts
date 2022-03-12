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
  commonValidatePostalcode,
} from 'moh-common-lib';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';

@Component({
  selector: 'fpir-personal-info',
  templateUrl: './personal-info.component.html',
})
export class PersonalInfoComponent extends BaseForm
  implements OnInit, AfterViewInit {
  readonly firstNameLen = 20;
  readonly lastNameLen = 35;
  readonly cityNameLen = 25;
  readonly addressLen = 75;
  readonly hasSpouseQuestion = 'Do you have a spouse?';

  /** Focuses the next element to the heading of a new page */
  @ViewChild('heading', {}) heading: ElementRef<HTMLInputElement>;

  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService,
    private fb: FormBuilder
  ) {
    super(router, containerService, pageStateService);
  }

  get hasSpouseFlag() {
    return this.incomeReviewDataService.hasSpouse;
  }

  // Labels stored in data service since used on multiple pages
  get applFirstNameLabel() {
    return this.incomeReviewDataService.applFirstNameLabel;
  }
  get applLastNameLabel() {
    return this.incomeReviewDataService.applLastNameLabel;
  }
  get applAddressLabel() {
    return this.incomeReviewDataService.applAddressLabel;
  }
  get phnLabel() {
    return this.incomeReviewDataService.phnLabel;
  }
  get spFirstNameLabel() {
    return this.incomeReviewDataService.spFirstNameLabel;
  }
  get spLastNameLabel() {
    return this.incomeReviewDataService.spLastNameLabel;
  }
  get spPhnLabel() {
    return this.incomeReviewDataService.spPhnLabel;
  }
  // NOTE: Label needs to be fixed in common library, once done this label can be removed.
  get applPostalCodeLabel() {
    return this.incomeReviewDataService.applPostalCodeLabel;
  }

  ngOnInit() {
    super.ngOnInit();

    // Use attribute 'required' rather than setting Valiator.required so that
    // screen readers indentify fields that are required
    this.formGroup = this.fb.group({
      firstName: [
        this.incomeReviewDataService.applicant.firstName,
        Validators.required,
      ],
      lastName: [
        this.incomeReviewDataService.applicant.lastName,
        Validators.required,
      ],
      address: [
        this.incomeReviewDataService.address.addressLine1,
        Validators.required,
      ],
      city: [this.incomeReviewDataService.address.city, Validators.required],
      postalCode: [
        this.incomeReviewDataService.address.postal,
        [Validators.required, commonValidatePostalcode(true, true)],
      ],
      phn: [this.incomeReviewDataService.applicant.phn, Validators.required],
      hasSpouse: [this.incomeReviewDataService.hasSpouse, Validators.required],
      spFirstName: [this.incomeReviewDataService.spouse.firstName],
      spLastName: [this.incomeReviewDataService.spouse.lastName],
      spPhn: [this.incomeReviewDataService.spouse.phn],
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.heading.nativeElement.focus();
    // subscribe to value changes
    this.formGroup.controls.firstName.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.applicant.firstName = val)
    );
    this.formGroup.controls.lastName.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.applicant.lastName = val)
    );
    this.formGroup.controls.address.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.address.addressLine1 = val)
    );
    this.formGroup.controls.city.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.address.city = val)
    );
    this.formGroup.controls.postalCode.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.address.postal = val)
    );
    this.formGroup.controls.phn.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.applicant.phn = val;
      this.checkDuplicatePhn(false);
    });
    this.formGroup.controls.hasSpouse.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.hasSpouse = val;
      this.updateSpouseValidators(val);
    });
    this.formGroup.controls.spFirstName.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.spouse.firstName = val)
    );
    this.formGroup.controls.spLastName.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.spouse.lastName = val)
    );
    this.formGroup.controls.spPhn.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.spouse.phn = val;
      this.checkDuplicatePhn();
    });
  }

  continue() {
    this.markAllInputsTouched();

    if (this.canContinue()) {
      this.navigate(INCOME_REVIEW_PAGES.INCOME.fullpath);
    }
  }

  updateSpouseValidators(hasSpouse: boolean) {
    const firstName = this.formGroup.controls.spFirstName;
    const lastName = this.formGroup.controls.spLastName;
    const spousePhn = this.formGroup.controls.spPhn;

    if (hasSpouse) {
      firstName.setValidators(Validators.required);
      lastName.setValidators(Validators.required);
      spousePhn.setValidators(Validators.required);
    } else {
      firstName.clearValidators();
      lastName.clearValidators();
      spousePhn.clearValidators();

      firstName.patchValue(null);
      lastName.patchValue(null);
      spousePhn.patchValue(null);

      // If income was entered and applicant removes spouse, income fields need to be cleared.
      this.incomeReviewDataService.spouse.clearIncome();
    }

    firstName.updateValueAndValidity();
    lastName.updateValueAndValidity();
    spousePhn.updateValueAndValidity();
    this.formGroup.updateValueAndValidity({ onlySelf: false });
  }

  checkDuplicatePhn(onSpouse: boolean = true) {
    if (
      this.incomeReviewDataService.applicant.hasPhn &&
      this.incomeReviewDataService.spouse.hasPhn
    ) {
      const duplicateError =
        this.hasSpouseFlag &&
        this.incomeReviewDataService.applicant.phn ===
          this.incomeReviewDataService.spouse.phn;

      if (duplicateError) {
        this.formGroup.controls.phn.setErrors(
          !onSpouse ? { duplicate: true } : null
        );
        this.formGroup.controls.spPhn.setErrors(
          onSpouse ? { duplicate: true } : null
        );
        return;
      }
    }

    // Clear duplicate errors
    if (this.formGroup.controls.phn.hasError('duplicate')) {
      this.formGroup.controls.phn.setErrors(null);
    }
    if (
      this.hasSpouseFlag &&
      this.formGroup.controls.spPhn.hasError('duplicate')
    ) {
      this.formGroup.controls.spPhn.setErrors(null);
    }
  }
}
