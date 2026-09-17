import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  SharedCoreModule,
  PageFrameworkComponent,
} from 'moh-common-lib-angular';

import { ReviewComponent } from './review.component';
import { ReviewContainerComponent } from '../../component/review-container/review-container.component';
import { FinancialInputComponent } from '../../component/financial-input/financial-input.component';
import { NgxMaskDirective, provideEnvironmentNgxMask } from 'ngx-mask';

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ReviewContainerComponent,
          ReviewComponent,
          FinancialInputComponent,
        ],
        imports: [
          FormsModule,
          ReactiveFormsModule,
          RouterTestingModule,
          SharedCoreModule,
          NgxMaskDirective,
          PageFrameworkComponent,
        ],
        providers: [provideEnvironmentNgxMask()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
