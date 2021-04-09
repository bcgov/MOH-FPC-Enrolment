import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoadPageGuardService } from 'moh-common-lib';

import { IncomeReviewComponent } from './income-review.component';
import { incomeReviewPageRoutes } from './income-review-pages.route';
import { INCOME_REVIEW_PAGES } from './income-review.constants';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';

const routes: Routes = [
  {
    path: '',
    component: IncomeReviewComponent,
    children: incomeReviewPageRoutes,
    canActivateChild: [LoadPageGuardService],
    data: { title: INCOME_REVIEW_PAGES.HOME.title },
  },
  {
    path: INCOME_REVIEW_PAGES.CONFIRMATION.path,
    component: ConfirmationComponent,
    data: { title: INCOME_REVIEW_PAGES.CONFIRMATION.title },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomeReviewRoutingModule {}
