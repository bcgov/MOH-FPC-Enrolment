import {
  async,
  ComponentFixture,
  TestBed,
  ComponentFixtureAutoDetect,
  inject,
} from '@angular/core/testing';

import { PersonalInfoComponent } from './personal-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  getDebugElement,
  setInput,
  clickRadioButton,
  MockRouter,
  getDebugInlineError,
  partialRequiredMsg,
} from '../../../_developmentHelpers/test-helpers';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { Router } from '@angular/router';
import { IncomeReviewDataService } from '../../services/income-review-data.service';

class MockDataService {
  hasSpouse: boolean;
}

function setHasSpouse(fixture: ComponentFixture<any>, valueName: string) {
  const btn = getDebugElement(fixture, 'common-radio', 'hasSpouse');
  clickRadioButton(btn, valueName);
}

function setInputField(
  fixture: ComponentFixture<any>,
  selector: string,
  fieldName: string,
  value: string = null
) {
  const _de = getDebugElement(fixture, selector, fieldName);
  setInput(_de, _de.componentInstance.labelforId, value);
}

function getInputErrorMsg(
  fixture: ComponentFixture<any>,
  selector: string,
  fieldName: string
) {
  const _de = getDebugElement(fixture, selector, fieldName);
  return getDebugInlineError(_de);
}

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalInfoComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedCoreModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: ComponentFixtureAutoDetect,
          useValue: true,
        },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display fields related to spouse when no spouse indicated', inject(
    [IncomeReviewDataService],
    (mockDataService: MockDataService) => {
      mockDataService.hasSpouse = false;
      fixture.detectChanges();

      expect(getDebugElement(fixture, 'common-name', 'spFirstName')).toBeNull();
      expect(getDebugElement(fixture, 'common-name', 'spLastName')).toBeNull();
      expect(getDebugElement(fixture, 'common-phn', 'spPhn')).toBeNull();
    }
  ));

  it('should display fields related to spouse when spouse indicated', inject(
    [IncomeReviewDataService],
    (mockDataService: MockDataService) => {
      mockDataService.hasSpouse = true;
      fixture.detectChanges();

      expect(
        getDebugElement(fixture, 'common-name', 'spFirstName')
      ).not.toBeNull();
      expect(
        getDebugElement(fixture, 'common-name', 'spLastName')
      ).not.toBeNull();
      expect(getDebugElement(fixture, 'common-phn', 'spPhn')).not.toBeNull();
    }
  ));

  it('should display required error when mandatory fields are empty (initial page)', () => {
    expect(component.canContinue()).toBeFalsy();
    component.continue();
    fixture.detectChanges();

    expect(getInputErrorMsg(fixture, 'common-name', 'firstName')).toContain(
      partialRequiredMsg
    );
    expect(getInputErrorMsg(fixture, 'common-name', 'lastName')).toContain(
      partialRequiredMsg
    );
    expect(getInputErrorMsg(fixture, 'common-phn', 'phn')).toContain(
      partialRequiredMsg
    );
    expect(getInputErrorMsg(fixture, 'common-street', 'address')).toContain(
      partialRequiredMsg
    );
    expect(getInputErrorMsg(fixture, 'common-city', 'city')).toContain(
      partialRequiredMsg
    );
    expect(
      getInputErrorMsg(fixture, 'common-postal-code', 'postalCode')
    ).toContain(partialRequiredMsg);
    expect(getInputErrorMsg(fixture, 'common-radio', 'hasSpouse')).toContain(
      partialRequiredMsg
    );
  });

  it('should display error when not BC postal code', () => {
    setInputField(fixture, 'common-postal-code', 'postalCode', 'T9V9V9');
    fixture.detectChanges();
    expect(
      getInputErrorMsg(fixture, 'common-postal-code', 'postalCode')
    ).toContain('Invalid postal code for British Columbia');
  });

  it('should be able to continue when data entered (no spouse)', inject(
    [Router],
    (mockRouter: MockRouter) => {
      // Set values for elements on page
      setInputField(fixture, 'common-name', 'firstName', 'Applicant');
      setInputField(fixture, 'common-name', 'lastName', 'Test');
      setInputField(fixture, 'common-phn', 'phn', '9999999998');
      setInputField(fixture, 'common-street', 'address', '123 York Street');
      setInputField(fixture, 'common-city', 'city', 'Victoria');
      setInputField(fixture, 'common-postal-code', 'postalCode', 'V9V9V9');
      setHasSpouse(fixture, 'false');
      fixture.detectChanges();

      expect(component.canContinue()).toBeTruthy();
      component.continue();
      expect(mockRouter.url).toBe(INCOME_REVIEW_PAGES.INCOME.fullpath);
    }
  ));

  it('should be no able to continue when spouse data is not entered (spouse)', () => {
    // Set values for elements on page
    setInputField(fixture, 'common-name', 'firstName', 'ApplicantWithSpouse');
    setInputField(fixture, 'common-name', 'lastName', 'TestWithSpouse');
    setInputField(fixture, 'common-phn', 'phn', '9999999998');
    setInputField(fixture, 'common-street', 'address', '123 Forest Lane');
    setInputField(fixture, 'common-city', 'city', 'Victoria');
    setInputField(fixture, 'common-postal-code', 'postalCode', 'V9V9Y9');
    setHasSpouse(fixture, 'true');
    fixture.detectChanges();

    fixture.whenRenderingDone().then(() => {
      expect(component.canContinue()).toBeFalsy();
      component.continue();
      fixture.detectChanges();

      expect(getInputErrorMsg(fixture, 'common-name', 'spFirstName')).toContain(
        partialRequiredMsg
      );
      expect(getInputErrorMsg(fixture, 'common-name', 'spLastName')).toContain(
        partialRequiredMsg
      );
      expect(getInputErrorMsg(fixture, 'common-phn', 'spPhn')).toContain(
        partialRequiredMsg
      );
    });
  });

  it('should indicate duplicate PHNs when same PHN entered for both spouse and applicant', () => {
    const partialErrorMsg = 'already used for another family member';

    // Set values for elements on page
    setHasSpouse(fixture, 'true');
    setInputField(fixture, 'common-phn', 'phn', '9999999998');

    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      setInputField(fixture, 'common-phn', 'spPhn', '9999999998');
      fixture.detectChanges();

      expect(getInputErrorMsg(fixture, 'common-phn', 'spPhn')).toContain(
        partialErrorMsg
      );

      setInputField(fixture, 'common-phn', 'spPhn', '9999999927');
      fixture.detectChanges();

      fixture.whenRenderingDone().then(() => {
        expect(getInputErrorMsg(fixture, 'common-phn', 'spPhn')).toBe('');

        setInputField(fixture, 'common-phn', 'phn', '9999999927');
        fixture.detectChanges();

        expect(getInputErrorMsg(fixture, 'common-phn', 'phn')).toContain(
          partialErrorMsg
        );
      });
    });
  });

  it('should be able to continue when data entered (spouse)', inject(
    [Router],
    (mockRouter: MockRouter) => {
      // Set values for elements on page
      setInputField(
        fixture,
        'common-name',
        'firstName',
        'Applicant-withSpouse'
      );
      setInputField(fixture, 'common-name', 'lastName', 'Test-two');
      setInputField(fixture, 'common-phn', 'phn', '9999999927');
      setInputField(fixture, 'common-street', 'address', '123 Redwood Street');
      setInputField(fixture, 'common-city', 'city', 'Victoria');
      setInputField(fixture, 'common-postal-code', 'postalCode', 'V9V8V9');
      setHasSpouse(fixture, 'true');
      fixture.autoDetectChanges();

      fixture.whenRenderingDone().then(() => {
        setInputField(
          fixture,
          'common-name',
          'spFirstName',
          'Spouse-for-applicant'
        );
        setInputField(fixture, 'common-name', 'spLastName', 'Test-two');
        setInputField(fixture, 'common-phn', 'spPhn', '9999999998');
        fixture.detectChanges();

        expect(component.canContinue()).toBeTruthy();
        component.continue();
        expect(mockRouter.url).toBe(INCOME_REVIEW_PAGES.INCOME.fullpath);
      });
    }
  ));

  it('Should display error when invalid characters are entered in name fields', () => {
    const partialInvalidCharMsg =
      ' must begin with a letter and cannot include special ' +
      'characters except hyphens, periods, apostrophes and blank characters.';

    setInputField(
      fixture,
      'common-name',
      'firstName',
      'Applicant098+WithSpouse'
    );
    setInputField(fixture, 'common-name', 'lastName', 'TestWithS#@pouse');

    setHasSpouse(fixture, 'true');
    fixture.autoDetectChanges();

    fixture.whenRenderingDone().then(() => {
      setInputField(fixture, 'common-name', 'spFirstName', 'Spouse=this903$');
      setInputField(fixture, 'common-name', 'spLastName', 'This*^)naem');
      fixture.detectChanges();

      expect(getInputErrorMsg(fixture, 'common-name', 'firstName')).toContain(
        partialInvalidCharMsg
      );
      expect(getInputErrorMsg(fixture, 'common-name', 'lastName')).toContain(
        partialInvalidCharMsg
      );
      expect(getInputErrorMsg(fixture, 'common-name', 'spFirstName')).toContain(
        partialInvalidCharMsg
      );
      expect(getInputErrorMsg(fixture, 'common-name', 'spLastName')).toContain(
        partialInvalidCharMsg
      );
    });
  });
});
