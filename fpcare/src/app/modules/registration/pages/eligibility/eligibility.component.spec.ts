import {
  waitForAsync,
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';

import { EligibilityPageComponent } from './eligibility.component';
import { CoreModule } from '../../../core/core.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { FPCareDataService } from '../../../../services/fpcare-data.service';
import { ValidationService } from '../../../../services/validation.service';
import { RegistrationService } from '../../registration.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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

describe('EligibilityComponent - Single Applicant', () => {
  let component: EligibilityPageComponent;
  let fixture: ComponentFixture<EligibilityPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EligibilityPageComponent],
      imports: [
        CoreModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        FPCareDataService,
        ValidationService,
        RegistrationService,
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibilityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cannot continue by default', () => {
    expect(component.canContinue()).toBeFalsy();
  });

  // Field Validations
  it('missing birthdate cannot continue', (done) => {
    component.applicant.phn = '9999 999 998';

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.canContinue()).toBeFalsy();

      done();
    });
  });

  it('missing PHN cannot continue', (done) => {
    component.applicant.sDateOfBirth = { year: 1989, month: 4, day: 1 };

    fixture.whenStable().then(() => {
      expect(component.canContinue()).toBeFalsy();

      done();
    });
  });

  it('required data populated can continue', (done) => {
    component.applicant.sDateOfBirth = { year: 1989, month: 4, day: 1 };

    fixture.whenStable().then(() => {
      const phnInput: HTMLInputElement =
        fixture.nativeElement.querySelector('fpcare-phn input');
      typeIntoInput(phnInput, '9999999998');
      fixture.detectChanges();

      expect(component.canContinue()).toBeTruthy();

      done();
    });
  });
});

describe('EligibilityComponent - Applicant with Spouse', () => {
  let component: EligibilityPageComponent;
  let fixture: ComponentFixture<EligibilityPageComponent>;
  let dataService: FPCareDataService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EligibilityPageComponent],
      imports: [
        CoreModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        FPCareDataService,
        ValidationService,
        RegistrationService,
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    dataService = TestBed.get(FPCareDataService);
    dataService.addSpouse();
    dataService.hasSpouse = true;
    fixture = TestBed.createComponent(EligibilityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cannot continue by default', () => {
    expect(component.canContinue()).toBeFalsy();
  });

  it('missing applicant birthdate cannot continue', (done) => {
    component.applicant.phn = '9999 999 998';
    component.spouse.sDateOfBirth = { year: 1989, month: 4, day: 1 };
    component.spouse.phn = '9999 999 973';

    fixture.whenStable().then(() => {
      expect(component.canContinue()).toBeFalsy();

      done();
    });
  });

  it('missing applicant phn cannot continue', (done) => {
    component.spouse.phn = '9999 999 998';
    component.spouse.sDateOfBirth = { year: 1989, month: 4, day: 1 };
    component.applicant.sDateOfBirth = { year: 1990, month: 5, day: 30 };

    fixture.whenStable().then(() => {
      expect(component.canContinue()).toBeFalsy();

      done();
    });
  });

  it('missing spouse birthdate cannot continue', (done) => {
    component.applicant.phn = '9999 999 998';
    component.applicant.sDateOfBirth = { year: 1989, month: 4, day: 1 };
    component.spouse.phn = '9999 999 973';

    fixture.whenStable().then(() => {
      expect(component.canContinue()).toBeFalsy();

      done();
    });
  });

  it('missing spouse phn cannot continue', (done) => {
    component.applicant.phn = '9999 999 998';
    component.applicant.sDateOfBirth = { year: 1989, month: 4, day: 1 };

    fixture.whenStable().then(() => {
      expect(component.canContinue()).toBeFalsy();

      done();
    });
  });

  it('required data populated can continue', (done) => {
    component.applicant.sDateOfBirth = { year: 1989, month: 4, day: 1 };
    component.spouse.sDateOfBirth = { year: 1990, month: 5, day: 30 };

    fixture.whenStable().then(() => {
      // DOM order matches template order: applicant's fpcare-phn first, spouse's second.
      const phnInputs: HTMLInputElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('fpcare-phn input')
      );
      typeIntoInput(phnInputs[0], '9999999998');
      typeIntoInput(phnInputs[1], '9999999973');
      fixture.detectChanges();

      expect(component.canContinue()).toBeTruthy();

      done();
    });
  });
});
