import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  SharedCoreModule,
  BYPASS_GUARDS,
  START_PAGE_URL,
  DefaultPageGuardService,
  AbstractPageGuardService,
  LoadPageGuardService,
} from 'moh-common-lib';
import { CaptchaModule } from 'moh-common-lib/captcha';
import { IncomeReviewRoutingModule } from './income-review-routing.module';
import { IncomeReviewComponent } from './income-review.component';
import { HomeComponent } from './pages/home/home.component';
import { ReviewComponent } from './pages/review/review.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { environment } from '../../environments/environment';
import { INCOME_REVIEW_PAGES } from './income-review.constants';
import { ConsentComponent } from './pages/consent/consent.component';
import { CollectionNoticeComponent } from './component/collection-notice/collection-notice.component';
import { CollectionNoticeDirective } from './component/collection-notice/collection-notice.directive';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReviewContainerComponent } from './component/review-container/review-container.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { IncomeComponent } from './pages/income/income.component';
import { TextMaskModule } from 'angular2-text-mask';
import { FinancialInputComponent } from './component/financial-input/financial-input.component';

@NgModule({
  declarations: [
    IncomeReviewComponent,
    HomeComponent,
    ReviewComponent,
    ConfirmationComponent,
    ConsentComponent,
    CollectionNoticeComponent,
    CollectionNoticeDirective,
    ReviewContainerComponent,
    PersonalInfoComponent,
    IncomeComponent,
    FinancialInputComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedCoreModule,
    IncomeReviewRoutingModule,
    ModalModule.forRoot(),
    CaptchaModule,
    TextMaskModule,
  ],
  providers: [
    {
      provide: BYPASS_GUARDS,
      useValue:
        environment.developmentMode.enabled &&
        environment.developmentMode.bypassGuards,
    },
    { provide: START_PAGE_URL, useValue: INCOME_REVIEW_PAGES.HOME.fullpath },
    DefaultPageGuardService,
    { provide: AbstractPageGuardService, useExisting: DefaultPageGuardService },
    LoadPageGuardService,
  ],
})
export class IncomeReviewModule {}
