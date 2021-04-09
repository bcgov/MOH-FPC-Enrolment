import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.constants';
import { SplashPageComponent } from './splash-page/splash-page.component';

const routes: Routes = [
  {
    path: APP_ROUTES.income_review,
    loadChildren: () =>
      import('./income-review/income-review.module').then(
        (m) => m.IncomeReviewModule
      ),
  },
  {
    path: APP_ROUTES.maintenance,
    component: SplashPageComponent,
    data: { title: APP_ROUTES.maintenance },
  },
  {
    path: '',
    redirectTo: APP_ROUTES.income_review,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
