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
  it('missing birthdate cannot continue', async () => {
    component.applicant.phn = '9999 999 998';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.canContinue()).toBeFalsy();
  });

  it('missing PHN cannot continue', async () => {
    component.applicant.sDateOfBirth = { year: 1989, month: 4, day: 1 };
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.canContinue()).toBeFalsy();
  });

  // TO FIX: PHN validation requires DOM-event-based form input; direct model mutation
  // does not trigger ngx-mask processing, so the form field stays invalid.
  xit('required data populated can continue', async () => {
    component.applicant.phn = '9999 999 998';
    component.applicant.sDateOfBirth = { year: 1989, month: 4, day: 1 };
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.canContinue()).toBeTruthy();
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

  it('missing applicant birthdate cannot continue', async () => {
    component.applicant.phn = '9999 999 998';
    component.spouse.sDateOfBirth = { year: 1989, month: 4, day: 1 };
    component.spouse.phn = '9999 999 973';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.canContinue()).toBeFalsy();
  });

  it('missing applicant phn cannot continue', async () => {
    component.spouse.phn = '9999 999 998';
    component.spouse.sDateOfBirth = { year: 1989, month: 4, day: 1 };
    component.applicant.sDateOfBirth = { year: 1990, month: 5, day: 30 };
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.canContinue()).toBeFalsy();
  });

  it('missing spouse birthdate cannot continue', async () => {
    component.applicant.phn = '9999 999 998';
    component.applicant.sDateOfBirth = { year: 1989, month: 4, day: 1 };
    component.spouse.phn = '9999 999 973';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.canContinue()).toBeFalsy();
  });

  it('missing spouse phn cannot continue', async () => {
    component.applicant.phn = '9999 999 998';
    component.applicant.sDateOfBirth = { year: 1989, month: 4, day: 1 };
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.canContinue()).toBeFalsy();
  });

  // TO FIX: PHN validation requires DOM-event-based form input; direct model mutation
  // does not trigger ngx-mask processing, so the form field stays invalid.
  xit('required data populated can continue', async () => {
    component.applicant.phn = '9999 999 998';
    component.applicant.sDateOfBirth = { year: 1989, month: 4, day: 1 };
    component.spouse.phn = '9999 999 973';
    component.spouse.sDateOfBirth = { year: 1990, month: 5, day: 30 };
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.canContinue()).toBeTruthy();
  });
});
