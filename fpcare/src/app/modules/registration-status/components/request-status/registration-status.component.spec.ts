import {
  waitForAsync,
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationStatusComponent } from './registration-status.component';
import { CoreModule } from '../../../core/core.module';
import { FPCareDataService } from '../../../../services/fpcare-data.service';
import { ValidationService } from '../../../../services/validation.service';
import { PhnValidationComponent } from '../../../../validation/phn-validation/phn-validation.component';
import { RequiredValidationErrorsComponent } from '../../../../validation/required-validation/required-validation.component';
import { RegNumberValidationComponent } from '../../../../validation/reg-number-validation/reg-number-validation.component';

// Assert that a form contains a control with the given error.
function formHasError(form: NgForm, errorKey: string): boolean {
  return (
    Object.keys(form.controls)
      .map((key) => form.controls[key].errors)
      .filter((x) => x)
      .map((x) => Object.keys(x))
      .filter((str) => str.includes(errorKey)).length === 1
  );
}

// Simulate real keystrokes into a masked <input>. FPCareRequiredDirective's
// NG_VALIDATOR (src/app/validation/fpcare-required.directive.ts) reads
// nativeElement.value directly rather than the FormControl value, so setting
// the bound model property (e.g. component.applicant.phn = '...') or even
// calling control.setValue() directly never updates what the validator sees.
// Writing through the native HTMLInputElement value setter and dispatching a
// bubbling 'input' event, one character at a time, goes through the same
// path a real keystroke does and is the only way to reach the validator with
// this directive's current implementation.
function typeIntoInput(input: HTMLInputElement, value: string): void {
  const nativeValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  ).set;
  value.split('').forEach((ch) => {
    nativeValueSetter.call(input, input.value + ch);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

describe('RegistrationStatusComponent', () => {
  let component: RegistrationStatusComponent;
  let fixture: ComponentFixture<RegistrationStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [RegistrationStatusComponent],
      providers: [
        FPCareDataService,
        ValidationService,
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationStatusComponent);

    component = fixture.componentInstance;
    // Set private prop 'fpcareDataService.acceptedCollectionNotice' to true
    component.onAccept(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cannot continue by default', () => {
    expect(component.canContinue()).toBeFalsy();
  });

  it('disables reg number when phn is filled out', () => {
    component.applicant.phn = '999999998';
    expect(component.disableRegNum()).toBeTruthy();
    expect(component.disablePhn()).toBeFalsy();
  });

  it('disables reg number when a dob field is filled out', () => {
    expect(component.disableRegNum()).toBeFalsy();

    component.applicant.sDateOfBirth = { year: null, day: 11, month: null };

    expect(component.disableRegNum()).toBeTruthy();
    expect(component.disablePhn()).toBeFalsy();
  });

  it('disables phn when reg number is filled out', () => {
    expect(component.disablePhn()).toBeFalsy();

    component.applicant.fpcRegNumber = 'A999999998';

    expect(component.disablePhn()).toBeTruthy();
    expect(component.disableRegNum()).toBeFalsy();
  });

  it('invalid PHN', (done) => {
    fixture.whenStable().then(() => {
      const phnInput: HTMLInputElement =
        fixture.nativeElement.querySelector('fpcare-phn input');
      typeIntoInput(phnInput, '9999999990');
      fixture.detectChanges();

      expect(component.form.valid).toBe(false);
      expect(
        formHasError(component.form, PhnValidationComponent.ERROR_STRING)
      ).toBeTrue();

      done();
    });
  });


  // TO FIX: using common library custom control form field
  xit('valid PHN', (done) => {
    component.applicant.phn = '9999999998';

    fixture.whenStable().then(() => {
      expect(component.form.valid).toBe(false);
      expect(
        formHasError(component.form, PhnValidationComponent.ERROR_STRING)
      ).toBeFalse();

      done();
    });
  });

  it('required PHN', (done) => {
    component.applicant.address.postal = 'V1D3G4';
    component.applicant.sDateOfBirth = { month: 1, day: 2, year: 1989 };

    fixture.whenStable().then(() => {
      expect(component.form.valid).toBe(false);
      expect(
        formHasError(
          component.form,
          RequiredValidationErrorsComponent.ERROR_STRING
        )
      ).toBeTrue();

      done();
    });
  });

  // TO FIX: using common library custom control form field
  xit('requires Postal Code', (done) => {
    component.applicant.phn = '9999999998';
    component.applicant.sDateOfBirth = { month: 1, day: 2, year: 1989 };

    fixture.whenStable().then(() => {
      expect(component.form.valid).toBe(false);
      // @TODO can this error key be a constant?
      expect(formHasError(component.form, 'required')).toBeTrue();

      done();
    });
  });

  it('invalid FPC Registration Number', (done) => {
    component.applicant.fpcRegNumber = 'B99999999';

    fixture.whenStable().then(() => {
      expect(component.form.valid).toBe(false);
      expect(
        formHasError(component.form, RegNumberValidationComponent.ERROR_STRING)
      ).toBeTrue();

      done();
    });
  });

  it('valid FPC Registration Number', (done) => {
    component.applicant.fpcRegNumber = 'A08349678';

    fixture.whenStable().then(() => {
      expect(component.form.valid).toBe(true);
      expect(
        formHasError(component.form, RegNumberValidationComponent.ERROR_STRING)
      ).toBeFalse();

      done();
    });
  });
});
