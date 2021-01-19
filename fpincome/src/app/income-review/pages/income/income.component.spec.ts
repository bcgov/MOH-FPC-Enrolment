import {
  async,
  ComponentFixture,
  TestBed,
  ComponentFixtureAutoDetect,
  inject,
} from '@angular/core/testing';

import { IncomeComponent } from './income.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { TextMaskModule } from 'angular2-text-mask';
import {
  clickValue,
  getCheckedValue,
  getDebugElement,
  getRadioBtnLabel,
  getRadioErrorMsg,
  MockRouter,
  partialRequiredMsg,
} from '../../../_developmentHelpers/test-helpers';
import { Router } from '@angular/router';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { FinancialInputComponent } from '../../component/financial-input/financial-input.component';
class MockDataService {
  hasSpouse: boolean;
  isLastYearIncome: boolean;
  hasRdspIncome: boolean;
}

function setInputField(
  fixture: ComponentFixture<any>,
  fieldName: string,
  value: string = null
) {
  const _de = getDebugElement(fixture, 'input', fieldName);
  const el = _de.nativeElement;
  el.focus();
  el.value = value;
  el.dispatchEvent(new Event('input'));
  el.dispatchEvent(new Event('change'));
  el.dispatchEvent(new Event('blur'));
}

describe('IncomeComponent', () => {
  let component: IncomeComponent;
  let fixture: ComponentFixture<IncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeComponent, FinancialInputComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedCoreModule,
        TextMaskModule,
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
    fixture = TestBed.createComponent(IncomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display required error when mandatory radio buttons are empty', () => {
    expect(component.canContinue()).toBeFalsy();
    component.continue();
    fixture.detectChanges();

    expect(getRadioErrorMsg(fixture, 'isLastYearIncome')).toContain(
      partialRequiredMsg
    );
  });

  it('should display gross income field', inject(
    [IncomeReviewDataService],
    (mockDataService: MockDataService) => {
      mockDataService.hasSpouse = false;
      mockDataService.isLastYearIncome = false;
      fixture.detectChanges();
      fixture.whenRenderingDone().then(() => {
        const _income = getDebugElement(
          fixture,
          'fpir-financial-input',
          'income'
        );
        expect(_income).not.toBeNull();

        //  const _uploader = getDebugElement(fixture, 'common-file-uploader', 'supportDocuments');
        //  expect(_uploader).not.toBeNull();
      });
    }
  ));

  it('should display total gross income when spouse indicated', inject(
    [IncomeReviewDataService],
    (mockDataService: MockDataService) => {
      mockDataService.hasSpouse = true;
      mockDataService.isLastYearIncome = false;
      fixture.detectChanges();
      fixture.whenRenderingDone().then(() => {
        let _income = getDebugElement(
          fixture,
          'fpir-financial-input',
          'income'
        );
        expect(_income).not.toBeNull();
        _income = getDebugElement(
          fixture,
          'fpir-financial-input',
          'spouseIncome'
        );
        expect(_income).not.toBeNull();
        // _income = getDebugElement(fixture, 'fpir-financial-input', 'incomeTotal');
        // expect(_income).not.toBeNull();

        // const _uploader = getDebugElement(fixture, 'common-file-uploader', 'supportDocuments');
        // expect(_uploader).not.toBeNull();
      });
    }
  ));

  it('should display net income field and no file uploader', () => {
    const _net = getDebugElement(fixture, 'common-radio', 'isLastYearIncome');
    clickValue(_net, true);
    fixture.detectChanges();

    expect(getCheckedValue(_net)).toBe('true');
    expect(getRadioBtnLabel(_net, true)).toContain('net income');

    const _income = getDebugElement(fixture, 'fpir-financial-input', 'income');
    expect(_income).not.toBeNull();

    const _rdsp = getDebugElement(fixture, 'common-radio', 'hasRdspIncome');
    expect(_rdsp).not.toBeNull();

    // const _uploader = getDebugElement(fixture, 'common-file-uploader', 'supportDocuments');
    // expect(_uploader).toBeNull();
  });

  it('should display total net income and no file upload uwhen spouse indicated', inject(
    [IncomeReviewDataService],
    (mockDataService: MockDataService) => {
      mockDataService.hasSpouse = true;
      mockDataService.isLastYearIncome = true;
      fixture.detectChanges();
      fixture.whenRenderingDone().then(() => {
        let _income = getDebugElement(
          fixture,
          'fpir-financial-input',
          'income'
        );
        expect(_income).not.toBeNull();
        _income = getDebugElement(
          fixture,
          'fpir-financial-input',
          'spouseIncome'
        );
        expect(_income).not.toBeNull();
        _income = getDebugElement(
          fixture,
          'fpir-financial-input',
          'incomeTotal'
        );
        expect(_income).not.toBeNull();

        const _rdsp = getDebugElement(fixture, 'common-radio', 'hasRdspIncome');
        expect(_rdsp).not.toBeNull();

        //  const _uploader = getDebugElement(fixture, 'common-file-uploader', 'supportDocuments');
        //   expect(_uploader).toBeNull();
      });
    }
  ));

  it('should display rdsp income fields and file uploader when select select has RDSP', inject(
    [IncomeReviewDataService],
    (mockDataService: MockDataService) => {
      mockDataService.hasSpouse = true;
      mockDataService.isLastYearIncome = true;
      mockDataService.hasRdspIncome = true;
      fixture.detectChanges();

      fixture.whenRenderingDone().then(() => {
        let _income = getDebugElement(
          fixture,
          'fpir-financial-input',
          'rdspIncome'
        );
        expect(_income).not.toBeNull();

        _income = getDebugElement(
          fixture,
          'fpir-financial-input',
          'netIncomeMinusRdsp'
        );
        expect(_income).not.toBeNull();

        //  const _uploader = getDebugElement(fixture, 'common-file-uploader', 'supportDocuments');
        //  expect(_uploader).not.toBeNull();
      });
    }
  ));
});
