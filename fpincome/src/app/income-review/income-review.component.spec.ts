import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import {
  SharedCoreModule,
  CoreBreadcrumbComponent,
  FormActionBarComponent,
  WizardProgressBarComponent,
} from 'moh-common-lib-angular';

import { IncomeReviewComponent } from './income-review.component';

describe('IncomeReviewComponent', () => {
  let component: IncomeReviewComponent;
  let fixture: ComponentFixture<IncomeReviewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [IncomeReviewComponent],
        imports: [
          RouterTestingModule,
          SharedCoreModule,
          CoreBreadcrumbComponent,
          FormActionBarComponent,
          WizardProgressBarComponent,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
