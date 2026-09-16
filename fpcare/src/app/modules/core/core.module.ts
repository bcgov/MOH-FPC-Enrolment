import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './components/alert/alert.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FPCareToggleComponent } from './components/toggle/toggle.component';
import { NgxMaskDirective, provideEnvironmentNgxMask } from 'ngx-mask';
import { FPCareRequiredDirective } from '../../validation/fpcare-required.directive';
import { RequiredValidationErrorsComponent } from '../../validation/required-validation/required-validation.component';
import { ConsentModalComponent } from './components/consent-modal/consent-modal.component';
import { CalendarFieldFormatterDirective } from './components/date/calendar-field-formatter.directive';
import { CalendarYearValidatorDirective } from './components/date/calendar-year.validator';
import { CalendarDayValidatorDirective } from './components/date/calendar-day.validator';
import { CalendarMonthValidatorDirective } from './components/date/calendar-month.validator';
import { CalendarFutureDatesDirective } from './components/date/calendar-future-dates.validator';
import { FPCareDateComponent } from './components/date/date.component';
import {PhnValidationComponent} from '../../validation/phn-validation/phn-validation.component';
import {SinValidationComponent} from '../../validation/sin-validation/sin-validation.component';
import {RegNumberValidationComponent} from '../../validation/reg-number-validation/reg-number-validation.component';
import {PcValidationComponent} from '../../validation/pc-validation/pc-validation.component';
import { ResultsFrameworkComponent } from './components/results-framework/results-framework.component';
import {NameValidationComponent} from '../../validation/name-validation/name-validation.component';
import { PhnComponent } from './components/phn/phn.component';
import { SinComponent } from './components/sin/sin.component';
import {NameComponent} from './components/name/name.component';
import { ModalFocusDirective } from './components/consent-modal/modal-focus.directive';
import { PhnDefinitionComponent } from './components/phn-definition/phn-definition.component';
import { SampleModalComponent } from './components/sample-modal/sample-modal.component';
import { CaptchaModule } from 'moh-common-lib-angular/captcha';
import {
  SharedCoreModule,
  PageFrameworkComponent,
  FormActionBarComponent,
  PostalCodeComponent,
  WizardProgressBarComponent,
  PageSectionComponent,
  CoreBreadcrumbComponent,
  AddressValidatorComponent,
} from 'moh-common-lib-angular';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

const componentList = [
  // AddressValidatorComponent,
  AlertComponent,
  FPCareToggleComponent,
  PhnComponent,
  SinComponent,
  NameComponent,
  FPCareRequiredDirective,
  RequiredValidationErrorsComponent,
  PhnValidationComponent,
  SinValidationComponent,
  RegNumberValidationComponent,
  PcValidationComponent,
  NameValidationComponent,
  ConsentModalComponent,
  CalendarFieldFormatterDirective,
  CalendarYearValidatorDirective,
  CalendarDayValidatorDirective,
  CalendarMonthValidatorDirective,
  CalendarFutureDatesDirective,
  FPCareDateComponent,
  ResultsFrameworkComponent,
  ModalFocusDirective,
  PhnDefinitionComponent,
  SampleModalComponent
];

@NgModule({
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    FormsModule,
    ProgressbarModule.forRoot(),
    RouterModule,
    ModalModule.forRoot(),
    NgxMaskDirective,
    TypeaheadModule,
    CaptchaModule,
    SharedCoreModule,
    PageFrameworkComponent,
    FormActionBarComponent,
    PostalCodeComponent,
    WizardProgressBarComponent,
    PageSectionComponent,
    CoreBreadcrumbComponent,
    AddressValidatorComponent
  ],
  declarations: [
    componentList
  ],
  exports: [
    componentList,
    SharedCoreModule,
    PageFrameworkComponent,
    FormActionBarComponent,
    PostalCodeComponent,
    WizardProgressBarComponent,
    PageSectionComponent,
    CoreBreadcrumbComponent,
    AddressValidatorComponent
  ],
  providers: [
    provideEnvironmentNgxMask()
  ]
})
export class CoreModule { }
